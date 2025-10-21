import { DataManager } from "./data_manager";
import { runtime } from "./runtime";
import type { WorkType } from "./types";

export class Work {
  public static defaultDuration: number = 120;

  // private static works: Work[] = [];
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
    console.log("-> getCurrentWork")
    const ids: string[] = runtime.getCandidateWorks();
    console.log("candidats", ids)
    if (ids.length) {
      // TODO Seulement si random dans les préférences
      const candidatId = ids[Math.floor(Math.random() * ids.length)];
      console.log("candidat ID", candidatId);
      const candidatData = this.get(candidatId as string).dataForClient;
      console.log("Candidat :", candidatData);
      return candidatData;
    } else {
      // Pas de candidats. Ça ne peut arriver que si aucune
      // tâche active n'est défini.
      return {ok: false, error: "No task."}
    }
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

  public get dataForClient(){
    return Object.assign(
      runtime.getTemporalInfos(this.id)
    , this.data);
  }

  // raccourcis
  public get id(){ return this.data.id; }

}

Work.init();