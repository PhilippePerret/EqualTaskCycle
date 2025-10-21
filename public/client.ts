import { Clock } from "../lib/Clock.js";
import type { RecType, RunTimeInfosType, WorkType } from "../lib/types.js";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";
import { prefs } from "./prefs";
import { help } from "./help.js";

export class Work {

  public static async init(){
    const res = await this.getCurrent();
    if (res === true) {
      prefs.init();
      Flash.notice(`App is ready. <span id="mes123">(Show help)</span>`)
      DGet('span#mes123').addEventListener('click', 
        help.show.bind(help, ['introduction', 'tasks_file', 'tasks_file_format']),
        {once: true, capture: true}
      )
    }
  }

  public static currentWork: Work;

  public static async addTimeToCurrentWork(time: number){
    if (time) {
      await this.currentWork.addTimeAndSave(time)
    } else {
      Flash.error("Work time too short to save.")
    }
  }


  private static get obj(){
    return this._obj || (this._obj = DGet('section#current-work-container')) as HTMLElement;
  }
  private static _obj: HTMLElement | null;

  /**
   * Récupère la tâche courante côté serveur et l'affiche
   * (récupère aussi les préférences et les options et les
   *  applique)
   */
  public static async getCurrent(): Promise<boolean> {
    const retour: RecType = await fetch(HOST + 'task/current')
    .then(r => r.json() as RecType);
    console.log("retour:", retour);
    prefs.setData(retour.prefs);
    Clock.setClockStyle(retour.prefs.clock);
    ui.setUITheme(retour.prefs.theme);
    if (retour.task.ok === false) {
      // <= il n'y aucune tâche active
      Flash.error('No active task. Set the task list.');
      return false;
    } else {
      ui.resetBackgroundColor();
      this.displayWork(retour.task, retour.options);
      return true;
    }
  }

  private static displayWork(
    wdata: WorkType & RunTimeInfosType,
    options: RecType
  ) {
    // console.log("Current Task", dataCurrentWork);
    this.currentWork = new Work(wdata);
    this.currentWork.display(options);
  }

  constructor(
    private data: WorkType & RunTimeInfosType
  ){
    console.log("this.data", this.data);
  }

  public get id(){ return this.data.id; }
  public get script(): string | undefined {return this.data.script}
  public get folder(): string | undefined {return this.data.folder}
  public get restTime(): number {return this.data.restTime}

  /**
   * Méthode d'instance pour sauver le temps
   */
  public async addTimeAndSave(time: number): Promise<boolean> {
    this.data.totalTime += time;
    this.data.cycleTime += time;
    this.data.restTime -= time;
    if (this.data.restTime < 0) { this.data.restTime = 0; }
    if ( this.data.cycleCount === 0 ) {
      this.data.cycleCount = 1;
      this.data.startedAt = Clock.getStartTime();
    }
    this.data.lastWorkedAt = Clock.getStartTime();
    console.log("[addTimeAndSave] Enregistrement des temps")
    const result: RecType = 
      await fetch(HOST+'work/save-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      })
      .then( r => r.json() );
    console.log("Retour save times: ", result);
    // On actualise l'affichage pour apercevoir les nouveaux temps
    // pendant 2 secondes puis on passe à la tâche suivante, qui a
    // été remontée.
    this.dispatchData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    Work.displayWork(result.next, result.options);
    if (result.ok) { Flash.success("New times saved.");}
    return true;
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
      runScript: !!this.data.script,
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

Work.init();
