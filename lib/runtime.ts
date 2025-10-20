/**
 * Ce que j'appelle le "runtime" ici, c'est ce qui concerne les temps 
 * de travail, notamment de chaque tâche, conservés dans le fichier
 * RUNTIMES dans le dossier support de l'application.
 */
import { existsSync } from 'fs';
import path from 'path';
import type { RecType, RunTimeInfosType } from './types';
import { Database } from "bun:sqlite"
import type { Work } from './work';
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


  public init(works: Work[], defaultDuration: number){
    if (false === existsSync(this.dbPath)) {
      this.buildDatabase();
    }
    this.insertNewWorks(works, defaultDuration);
  }

  /**
   * @api
   * 
   * On retourne toutes les tâches qui peuvent être travaillées
   */
  public getCandidateWorks(){
    const request = `SELECT id FROM works WHERE active = 1 AND restTime > 0`;
    const activeIds = this.db.query(request).all().map((row: any) => row.id);
    console.log("active ids :", activeIds);
    // TODO Si aucune tâche => recommencer un cycle
    return activeIds;
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
      active INTEGER
    )`.trim().replace(/\n\s+/m,' ');
    console.log("Request:", request);
    this.db.run(request);
  }

  /**
   * On fait les enregistrements pour les travaux courants
   * (seulement lorsque la base n'existe pas ou plus)
   * 
   * Cette fonction est appelée à chaque lancement de 
   * l'application.
   */
  private insertNewWorks(works: Work[], defaultDuration: number){
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

  private initRuntimeForWork(work: Work, defaultDuration: number){
    this.db.run("INSERT INTO works VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [work.id, 0, 0, defaultDuration, 0, new Date().getTime(), null, 1])
  }

  private get dbPath(){
    return path.join(userDataPath as string, 'RUNTIMES.db')
  }
}

export const runtime = RunTime.getInstance();