import { DataManager } from "./data_manager";
import { prefs } from "./prefs";
import { runtime } from "./runtime";
import type { RecType, WorkType } from "../shared/types";
import { t } from '../shared/Locale';

export class Work {
  public static defaultDuration: number;
  public static inited: boolean = false;

  // private static works: Work[] = [];
  private static table: {[x:string]: Work} = {};

  /**
   * Initialisation de l'application (au niveau des travaux)
   */
  public static init() {
    const works: WorkType[] = this.dataManager.getData();
    this.defaultDuration = prefs.data.duree;
    this.table = {};
    works.forEach((wdata: WorkType) => {
      const w = new Work(wdata)
      Object.assign(this.table, {[w.id]: w});
    });
    runtime.init(works, this.defaultDuration);
    this.inited = true;
  }

  public static get(workId: string): Work {
    return this.table[workId] as Work;
  }

  /**
   * Crée le tout premier fichier, à l'ouverture de l'app
   */
  public static buildPrimoFile(){
    if (false === this.inited) { this.init() }
    console.log("-> buildPrimoFile")
    this.saveAllData(this.dataManager.defaultData);
  }

  /**
   * Retourne le travail courant
   */
  public static getCurrentWork(options: RecType | undefined = {}){
    console.log("-> getCurrentWork")
    if (false === this.inited) { this.init() }
    let ids: string[] = runtime.getCandidateWorks();
    if (options.but) {
      ids = ids.filter(id => id != options.but)
    }
    console.log("candidats", ids)
    let candidatId: string;
    if (ids.length) {
      if (ids.length === 1) {
        candidatId = ids[0] as string;
      } else if (prefs.data.random) {
        candidatId = ids[Math.floor(Math.random() * ids.length)] as string;
      } else if (prefs.data.shortest) {
        candidatId = ids[0] as string;
      } else {
        candidatId = ids.pop() as string;
        ids.push(candidatId);// pour débug
      }
      console.log("candidat ID", candidatId);
      let candidatData;
      try {
        candidatData = this.get(candidatId as string).dataForClient;
      } catch(err) {
        return {ok: false, error: `Impossible d'obtenir la tâche '${candidatId}' (ids = ${ids.join(', ')}) : ${(err as any).message}`}
      }
      console.log("Candidat :", candidatData);
      return candidatData;
    } else {
      // Pas de candidats. Ça ne peut arriver que si aucune
      // tâche active n'est défini.
      return {ok: false, error: t('task.any_active')}
    }
  }

  public static saveAllData(allData: WorkType[]) {
    if (false === this.inited) { this.init() }
    this.dataManager.setData(allData);
  }

  private static get dataManager(){
    return this._datamanager || (this._datamanager = new DataManager())
  }; private static _datamanager: DataManager;



  constructor(
    private data: WorkType
  ){}

  public get dataForClient(){
    return Object.assign(
      runtime.getTemporalInfos(this.id)
    , this.data);
  }

  // raccourcis
  public get id(){ return this.data.id; }

}