import { DataManager } from "./data_manager";
import { runtime } from "./runtime";
import type { RunTimeInfosType, WorkType } from "./types";

export class Work {
  public static defaultDuration: number = 120;

  private static works: Work[] = [];
  private static table: {[x:string]: Work} = {};

  /**
   * Initialisation de l'application (au niveau des travaux)
   */
  public static init() {
    const dataManager = new DataManager();
    const works = dataManager.getData().works;
    this.defaultDuration = dataManager.getDefaultDuration();
    this.table = {};
    works.forEach((wdata: WorkType) => {
      const w = new Work(wdata)
      Object.assign(this.table, {[w.id]: w});
    });
    runtime.init(works, this.defaultDuration);
  }

  public static get(workId: string): Work {
    return this.table[workId] as Work;
  }

  /**
   * Retourne le travail courant
   */
  public static getCurrentWork(){
    const ids: string[] = runtime.getCandidateWorks();
    const candidatId = ids[Math.floor(Math.random() * ids.length)]
    return this.get(candidatId as string);
  }

  /**
   * Ajout d'un travail instancié (qui se trouve dans le fichier des
   * données des travaux/tâches)
   * 
   * On en profite aussi pour récupérer son temps de travail.
   * 
   * @param work Le travail à ajouter
  */
 public static add(work: Work) {

}

  constructor(
    private data: WorkType
  ){
    Work.add(this);
  }

  public runtimeInfos!: RunTimeInfosType;

  // raccourcis
  public get id(){ return this.data.id; }


  private startTime!: Date;
  private stopTime!: Date;

  public start(){
    // Flash.notice("Début du travail sur « " + this.data.project + " »");
    this.startTime = new Date();
  }
  public stop(){
    this.stopTime = new Date();
  }

}