import { DataManager } from "./data_manager";
import { RunTime } from "./runtime";
import type { RecType, RunTimeInfosType, WorkType } from "./types";

export class Work {
  private static runtimer: RunTime;
  public static defaultDuration: number = 120;

  private static works: Work[] = [];
  private static table: {[x:string]: Work} = {};

  /**
   * Initialisation de l'application (au niveau des travaux)
   */
  public static init() {
    this.runtimer = new RunTime();
    this.runtimer.init();
    const dataManager = new DataManager();
    const works = dataManager.getData().works;
    this.defaultDuration = dataManager.getDefaultDuration();
    works.forEach((wdata: WorkType) => new Work(wdata));
  }
  /**
   * Retourne un travail choisi au hasard
   */
  public static random(): Work | undefined {
    let ary = this.works.filter((work: Work) => {
      return work.hasTimeLeft();
    })
    if ( ary.length === 0 ) {
      ary = structuredClone(this.works) as Work[];
    }
    return ary[Math.floor(Math.random() * ary.length)]
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
    work.runtimeInfos = this.runtimer.getInfosOn(work.id);
    this.works.push(work);
    Object.assign(this.table, {[work.id]: work});
  }

  public static get(workId: string): Work | undefined {
    return this.table[workId];
  }

  constructor(
    private data: WorkType
  ){
    Work.add(this);
  }

  public runtimeInfos!: RunTimeInfosType;

  // raccourcis
  public get id(){ return this.data.id; }

  // @return Le temps qui a déjà été consacré à cette tâche
  private get workedDuration(): number {
    return this.runtimeInfos.workedTime;
  }

  private startTime!: Date;
  private stopTime!: Date;

  public start(){
    console.log("Je commence le travail " + this.data.name);
    this.startTime = new Date();
  }
  public stop(){
    this.stopTime = new Date();
  }

  /**
   * Le temps restant à travailler. C'est le temps de travail sur
   * la tâche moins le temps déjà travaillé.
   */
  private get timeLeft(){
    return this.workDuration - this.workedDuration;
  }

  /**
   * @return True s'il reste du temps de travail sur cette
   * tâche.
   */
  public hasTimeLeft(): boolean {
    return this.timeLeft > 0;
  }

  /**
   * Retourne le temps nécessaire de travail sur la tâche
   * C'est soit le temps défini explicitement, soit le
   * temps par défaut
   */
  private get workDuration(): number {
    return this.data.duration || Work.defaultDuration;
  }
}