/**
 * Ce que j'appelle le "runtime" ici, c'est ce qui concerne les temps 
 * de travail, notamment de chaque tâche, conservés dans le fichier
 * RUNTIMES dans le dossier support de l'application.
 */
import { existsSync } from 'fs';
import path from 'path';
import type { RecType, RunTimeInfosType, WorkType } from './types';
import { Database } from "bun:sqlite"
import { userDataPath } from './constants_server';


export class RunTime {
  private constructor(){}
  private static instance: RunTime;
  public static getInstance(){
    return this.instance || (this.instance = new RunTime())
  }

  private get db(){
    return this._db || (this._db = new Database(this.dbPath));
  }; private _db!: Database;


  public init(works: WorkType[], defaultDuration: number){
    if (false === existsSync(this.dbPath)) {
      this.buildDatabase();
    }
    this.insertNewWorks(works, defaultDuration);
  }

  /**
   * @return les infos temporelles du travail d'identifiant workId
   * 
   * @param workId Identifiant du travail
   */
  public getTemporalInfos(workId: string): RecType {
    const request = 'SELECT * FROM works WHERE id = ? LIMIT 1';
    const query = this.db.prepare(request);
    const result = query.get(workId);
    // console.log("Result de getTemporalInfos", result);
    return result as RecType;
  }

  /**
   * @api
   * 
   * On retourne toutes les tâches qui peuvent être travaillées.
   * C'est forcément une tâche qui est active, qui a du temps de
   * travail restant et qui n'a pas encore été travaillée 
   * aujourd'hui.
   * 
   */
  public getCandidateWorks(){
    const request = `SELECT id FROM works WHERE active = 1 AND restTime > 0 AND (lastWorkedAt IS NULL OR lastWorkedAt <= ${this.startOfToday})`;
    const activeIds = this.db.query(request).all().map((row: any) => row.id);
    console.log("Candidats ids :", activeIds);
    if ( activeIds.length === 0 ) {
      // TODO Si aucune tâche => recommencer un cycle
      // TODO S'assurer qu'il y a bien des tâches ?
    }
    return activeIds;
  }
  private get startOfToday(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.getTime();
  }


  /**
   * Construction de la base de données
   */
  private buildDatabase(){
    const request = `
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      totalTime INTEGER,
      cycleTime INTEGER,
      restTime INTEGER,
      cycleCount INTEGER,
      startedAt INTEGER,
      lastWorkedAt INTEGER,
      active INTEGER,
      defaultRestTime INTEGER
    )`.trim().replace(/\n\s+/m,' ');
    this.db.run(request);
  }

  /**
   * Actualisation des données d'exécution du travail
   */
  updateWork(dw: WorkType & RunTimeInfosType){
    const request: string = `
      UPDATE works
      SET
        startedAt = ?,
        totalTime = ?,
        cycleTime = ?,
        restTime = ?,
        cycleCount = ?,
        lastWorkedAt = ?
      WHERE
        id = ?
    `;
    const data = [
      dw.startedAt,
      dw.totalTime,
      dw.cycleTime,
      dw.restTime,
      dw.cycleCount,
      dw.lastWorkedAt,
      dw.id
    ];
    this.db.run(request, data);
    this.checkIfCycleIsComplete();
  }

  /**
   * Fonction qui regarde si un cycle est terminé et s'il faut en
   * recommencer un autre.
   * 
   * Un cycle est terminé lorsque toutes les tâches ont un temps
   * restant (restTime) à zéro.
   */
  private checkIfCycleIsComplete(): boolean {
    const request = `
      SELECT id 
      FROM works
      WHERE
        active = 1
        AND 
        restTime > 0
      LIMIT 1
      `;
    if ( this.db.query(request).all().length ) {
      // On a pu trouver au moins une tâche avec du temps
      // restant, on peut donc s'arrêter là
      return true;
    }
    // On a trouvé aucune tâche avec un tempsn restant, donc
    // on va commencer un nouveau cycle.
    return this.startNewCycle();
  }

  /**
   * Fonction pour commencer un nouveau cycle.
   */
  startNewCycle(): boolean {
    const request = `
    UPDATE 
      works
    SET
      cycleCount = cycleCount + 1,
      restTime = defaultRestTime
    WHERE
      active = 1
    `
    const result = this.db.run(request);
    return result.changes > 0;
  }
  /**
   * On fait les enregistrements pour les travaux courants
   * (seulement lorsque la base n'existe pas ou plus)
   * 
   * Cette fonction est appelée à chaque lancement de 
   * l'application.
   */
  private insertNewWorks(works: WorkType[], defaultDuration: number){
    const allIds = this.db.query('SELECT id FROM works').all().map((row: any) => row.id);
    console.log("retour", allIds);
    works.forEach(work => {
      if (allIds.find((id) => id === work.id)) { return ; }
      // Nouveau travail
      this.initRuntimeForWork(work, defaultDuration);
    });
    // On désactive les tâches qui ne sont plus en cours mais
    // qui l'étaient
    const allIdsON = works.map(w => w.id);
    const interros = allIdsON.map(id => '?').join(',');
    // On désactive les tâches qui ne sont plus en cours
    const reqDesactivate = `UPDATE works SET active = 0 WHERE active = 1 AND id NOT IN (${interros})`;
    this.db.run(reqDesactivate, allIdsON);
    // On active les tâches qui avaient peut-être été désactivées
    const reqActivate = `UPDATE works SET active = 1 WHERE active = 0 AND id IN (${interros})`;
    this.db.run(reqActivate, allIdsON);
  }

  private initRuntimeForWork(work: WorkType, defaultDuration: number){
    const duration = work.duration || defaultDuration
    const request = `
    INSERT 
    INTO 
      works
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    this.db.run(request, [work.id, 0, 0, duration, 0, new Date().getTime(), null, 1, duration])
  }

  private get dbPath(){
    return path.join(userDataPath as string, 'RUNTIMES.db')
  }
}

export const runtime = RunTime.getInstance();