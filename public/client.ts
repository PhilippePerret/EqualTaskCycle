import type { RecType, WorkType } from "../lib/types.js";
import { PORT } from "./constants.js";
import { ui } from "./ui.js";

const HOST = `http://localhost:${PORT}/`;

class Work {

  private static currentWork: Work;

  private static get obj(){
    return this._obj || (this._obj = document.body.querySelector('section#current-work-container')) as HTMLElement;
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
      runScript: true, // TODO À DÉFINIR
      openFolder: true, // TODO à définir
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

Work.getCurrent();