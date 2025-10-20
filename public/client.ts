import { Clock } from "../lib/Clock.js";
import type { RecType, WorkType } from "../lib/types.js";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./js/ui";
import { prefs } from "./prefs";

class Work {

  public static init(){
    this.getCurrent();
    prefs.init();
    Flash.notice("L'application est prête.")
  }

  private static currentWork: Work;

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
    private data: WorkType
  ){}

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