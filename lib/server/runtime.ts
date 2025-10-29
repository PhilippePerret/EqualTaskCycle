/**
 * Ce que j'appelle le "runtime" ici, c'est ce qui concerne les temps 
 * de travail, notamment de chaque tâche, conservés dans le fichier
 * RUNTIMES dans le dossier support de l'application.
 */
import { existsSync } from 'fs';
import path from 'path';
import type { RecType, RunTimeInfosType, WorkType } from '../shared/types';
import { Database } from "bun:sqlite"
import { userDataPath } from './constants_server';


export class RunTime { /* singleton */
  
  private constructor(){}
  private static inst: RunTime;
  public static singleton(){return this.inst || (this.inst = new RunTime())}


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
   * Retourne les données temporelles de toutes les tâches dont
   * les identifiants sont fournis
   * 
   */
  public getAllDataOf(ids: string[]): RecType {
    const request = `
    SELECT * FROM works WHERE id IN (${ids.map(_s => '?').join(', ')})
    `;
    return this.db.query(request).all(...ids);
  }
  /**
   * @return les infos temporelles du travail d'identifiant workId
   * 
   * @param workId Identifiant du travail
   */
  public getTemporalInfos(workId: string): RecType {
    const request = `
    SELECT 
      * 
    FROM 
      works 
    WHERE 
      id = ? 
    LIMIT 
      1
    `;
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
  public getCandidateWorks(options: RecType | undefined = {}): string[] {
    let condition: string[] | string = []
    condition.push('active = 1');
    condition.push('leftTime > 0');
    if (options.no_time_constraint !== true) {
      condition.push(`(lastWorkedAt IS NULL OR lastWorkedAt <= ${this.startOfToday})`)
    }
    condition = condition.join(' AND ')
    console.log("condition = %s", condition);
    const request = `
    SELECT 
      id 
    FROM 
      works 
    WHERE 
      ${condition}
    ORDER BY 
      leftTime DESC
    `;
    const activeIds = this.db.query(request).all().map((row: any) => row.id);
    console.log("Candidats ids :", activeIds);
    if ( activeIds.length === 0 ) {
      /**
       * L'absence de candidats trouvés peut avoir plusieurs causes :
       * 1) il n'y a aucune tâche active
       *    => Alerte à l'utilisateur
       * 2) il n'y plus de tâches avec du temps restant 
       *    => Il faut actualiser un nouveau cycle
       * 3) toutes les tâches actives ont été jouées (brièvement) aujourd'hui
       *    => On choisit les tâches sans la contrainte du temps
       */
      if ( this.aucuneTacheActive() ) { // #1
        console.log("=> Aucune tâche active");
        return [];
      } else if ( this.aucuneTacheWithRestTime() ) { // #2
        console.log("=> Nouveau cycle à initialiser");
        this.startNewCycle();
        return this.getCandidateWorks();
      } else { // #3
        console.log("=> Toutes les tâches ont été jouées aujourd'hui.")
        return this.getCandidateWorks({no_time_constraint: true});
      }
    }
    return activeIds;
  }

  // Return true if last change is far from today
  public lastChangeIsFarEnough(){
    const request = `
    SELECT
      v
    FROM
      keypairs
    WHERE
      k = "lastChangedAt"
    `
    const result = this.db.query(request).all();
    if (result.length) {
      return Number((result as any)[0]['val']) < this.startOfToday;
    } else {
      return true;
    }
  }

  public setLastChange(){
    const request = `
    REPLACE INTO 
      keypairs
      (k, v) 
    VALUES 
      (?, ?)
    `
    const query = this.db.prepare(request);
    query.run('lastChangedAt', new Date().getTime());
  }

  private aucuneTacheActive(): boolean {
    return this.count('active = 1') === 0
  }
  private aucuneTacheWithRestTime(): boolean {
    return this.count('active = 1 AND leftTime > 0') === 0
  }

  /**
   * @return Le nombre d'éléments remplissant la condition 
   * +condition+
   * 
   * @param condition La condition qui doit être remplie
   */
  private count(condition: string): number {
  const request = `
    SELECT 
      COUNT(id)
    FROM
      works
    WHERE
      ${condition}
    `;
    const res: RecType = this.db.query(request).get() as RecType;
    return res["COUNT(id)"];
  }

  /**
   * @api
   * 
   * Pour réinitialiser le cycle
   * 
   */
  public resetCycle(){
    console.log("-> runtime.resetCycle");
    try {
      const request = `
      UPDATE
        works
      SET
        cycleTime = 0,
        leftTime = defaultLeftTime
      WHERE
        active = 1
      `
      this.db.run(request);
      return {ok: true, error: undefined}
    } catch(err) {
      return {ok: false, error: (err as any).message}
    }
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
      sessionTime INTEGER,
      leftTime INTEGER,
      cycleCount INTEGER,
      startedAt INTEGER,
      lastWorkedAt INTEGER,
      active INTEGER,
      defaultLeftTime INTEGER,
      report STRING
    );
    CREATE TABLE IF NOT EXISTS keypairs (
      k TEXT PRIMARY KEY,
      v TEXT
    )
    `.trim().replace(/\n\s+/m,' ');
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
        leftTime = ?,
        cycleCount = ?,
        lastWorkedAt = ?,
        report = ?
      WHERE
        id = ?
    `;
    const data = [
      dw.startedAt,
      dw.totalTime,
      dw.cycleTime,
      dw.leftTime,
      dw.cycleCount,
      dw.lastWorkedAt,
      dw.report,
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
   * restant (leftTime) à zéro.
   */
  private checkIfCycleIsComplete(): boolean {
    const request = `
      SELECT id 
      FROM works
      WHERE
        active = 1
        AND 
        leftTime > 0
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
      cycleTime = 0,
      leftTime = defaultLeftTime
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
    // console.log("retour", allIds);
    works.forEach(work => {
      if (allIds.find((id) => id === work.id)) { return }
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
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    this.db.run(request, [work.id, 0, 0, 0, duration, 0, new Date().getTime(), null, 1, duration, ""])
  }

  private get dbPath(){
    return path.join(userDataPath as string, 'RUNTIMES.db')
  }
}

export const runtime = RunTime.singleton();