import { Clock } from "../lib/Clock.js";
import type { RecType, RunTimeInfosType, WorkType } from "../lib/types.js";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";
import { prefs } from "./prefs";

export class Work {

  public static init(){
    this.getCurrent();
    prefs.init();
    Flash.notice("L'application est prête.")
  }

  private static currentWork: Work;

  public static async addTimeToCurrentWork(time: number){
    console.log("Je dois apprendre à ajouter le temps", time, this.currentWork);
    if (time) {
      this.currentWork.addTimeAndSave(time);
    } else {
      Flash.error("Work time too short to save it.")
    }
  }


  private static get obj(){
    return this._obj || (this._obj = DGet('section#current-work-container')) as HTMLElement;
  }
  private static _obj: HTMLElement | null;

  public static async getCurrent(){
    const retour: RecType = await fetch(HOST + 'task/current')
    .then(r => r.json() as RecType);
    const dataCurrentWork = retour.task;
    // console.log("Current Task", dataCurrentWork);
    this.currentWork = new Work(dataCurrentWork);
    this.currentWork.display(retour.options);
    prefs.setData(retour.prefs);
    Clock.setClockStyle(retour.prefs.clock);
  }

  constructor(
    private data: WorkType & RunTimeInfosType
  ){
    console.log("this.data", this.data);
  }

  public get id(){ return this.data.id; }

  /**
   * Méthode d'instance pour sauver le temps
   */
  public async addTimeAndSave(time: number){
    this.data.totalTime += time;
    this.data.cycleTime += time;
    this.data.restTime -= time;
    if (this.data.restTime < 0) { this.data.restTime = 0; }
    if ( this.data.cycleCount === 0 ) {
      this.data.cycleCount = 1;
      this.data.startedAt = Clock.getStartTime();
    }
    this.data.lastWorkedAt = Clock.getStartTime();
    console.log("Enregistrement des temps")
    const result = await fetch(HOST+'work/save-times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.data)
    }).then( r => r.json );
    console.log("Retour save times: ", result);
    // On actualise l'affichage
    this.dispatchData();
  }

  /**
   * Fonction appelée pour afficher le travail (courant)
   */
  display(options: {[x: string]: any}){
    this.dispatchData();
    ui.showButtons({
      Start: true,
      Stop: false,
      Pause: false,
      Change: options.canChange,
      runScript: !!this.data.startupScript,
      openFolder: !!this.data.folder,
    });
  }

  dispatchData(){
    Object.entries(this.data).forEach(([k, v]) => {
      v = ((prop: string, v: any) => {
        switch(prop){
          case 'totalTime': 
          case 'cycleTime':
          case 'restTime':
            return Clock.time2horloge(v);
          default: 
            return v;
        }
      })(k, v);
      const propField = this.field(k);
      if ( propField ) {
        propField.innerHTML = v;
      }
    })
  }

  field(prop: string){
    return Work.obj.querySelector(`#current-work-${prop}`);
  }
}

// // POST
// await fetch(HOST + 'api/task/start', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ taskId: 123 })
// });

Work.init();