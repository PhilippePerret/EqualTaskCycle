import type { RecType, WorkType } from "../lib/types.js";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./js/ui";

class Work {

  public static init(){
    Work.getCurrent();
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
    // console.log("Current Task", currentWork);
    this.currentWork = new Work(dataCurrentWork);
    this.currentWork.display();
  }

  constructor(
    private data: WorkType
  ){}

  /**
   * Fonction appelée pour afficher le travail (courant)
   */
  display(){
    this.dispatchData();
    ui.showButtons({
      Start: true,
      Stop: false,
      Pause: false,
      Change: true,
      runScript: !!this.data.startupScript,
      openFolder: !!this.data.folder,
    });
  }

  dispatchData(){
    Object.entries(this.data).forEach(([k, v]) => {
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

// POST
await fetch(HOST + 'api/task/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ taskId: 123 })
});

Work.init();