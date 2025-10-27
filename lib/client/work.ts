import { clock } from "./Clock.js";
import type { RecType, RunTimeInfosType, WorkType } from "../shared/types.js";
import { DGet } from "../../public/js/dom.js";
import { Flash } from "../../public/js/flash.js";
import { ui } from "./ui.js";
import { prefs } from "./prefs.js";
import { help } from "./help.js";
import { editor } from "./editing.js";
import { EndWorkReport } from "./stop_report.js";
import { markdown, postToServer } from "../shared/utils.js";
import { loc, t } from "../shared/Locale.js";

export class Work {

  /**
   * @main
   * @api
   * 
   * Point d'entrée de l'application au niveau client.
   * 
   */
  public static async init(){
    console.log("-> Initialisation de Work")
    const res = await this.getCurrent();
    console.log("Retour de getCurrent:", res);
    if (res === true) {
      prefs.init();
      editor.init();
      Flash.notice(`${t('app.is_ready')} <span id="mes123">(${t('help.show')})</span>`)
      DGet('span#mes123').addEventListener('click', 
        help.show.bind(help, ['resume_home_page']),
        {once: true, capture: true}
      )
    }
  }

  public static currentWork: Work;

  /**
   * Ajout de la durée de travail +time+ au projet courant, mais
   * seulement si ce temps excède la minute.
   */
  public static async addTimeToCurrentWork(time: number){
    if ( time ) {
    // if ( true ) {
      await this.currentWork.addTimeAndSave(time)
    } else {
      Flash.error(t('times.to_short_to_be_saved'))
    }
  }

  /**
   * Méthode d'instance pour sauver le temps
   */
  public async addTimeAndSave(time: number): Promise<boolean> {
    this.data.totalTime += time;
    this.data.cycleTime += time;
    this.data.leftTime -= time;
    if (this.data.leftTime < 0) { this.data.leftTime = 0; }
    if ( this.data.cycleCount === 0 ) {
      this.data.cycleCount = 1;
      this.data.startedAt = clock.getStartTime() * 1000;
    }
    this.data.lastWorkedAt = clock.getStartTime() * 1000;
    const stopReport = await new EndWorkReport(this).writeReport();
    if (!stopReport /* annulation */) {
      await Work.getCurrent();
      return false;
    }


    
    this.data.report = stopReport as string;
    console.log("[addTimeAndSave] Enregistrement des temps et du rapport", this.data);
    const result: RecType = await postToServer('/work/save-session', this.data);
    // console.log("Retour save session: ", result);
    // On actualise l'affichage pour apercevoir les nouveaux temps
    // pendant 2 secondes puis on passe à la tâche suivante, qui a
    // été remontée.
    this.dispatchData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    Work.displayWork(result.next, result.options);
    if (result.ok) { Flash.success(t('times.saved'));}
    return true;
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
    const retour: RecType = await postToServer('/task/current', {process: 'Work::getCurrent'});
    console.log("retour:", retour);
    if (retour.ok === false) { return false}
    prefs.setData(retour.prefs);
    await loc.init(prefs.getLang());
    clock.setClockStyle(retour.prefs.clock);
    clock.setCounterMode(retour.prefs.counter);
    ui.setUITheme(retour.prefs.theme);
    if (retour.task.ok === false) {
      // <= il n'y aucune tâche active
      Flash.error(t('task.any_active'));
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
    // console.log("this.data", this.data);
  }

  public get id(){ return this.data.id; }
  public get script(): string | undefined {return this.data.script}
  public get folder(): string | undefined {return this.data.folder}
  public get leftTime(): number {return this.data.leftTime}
  public get cycleTime(): number {return this.data.cycleTime}
  public get totalTime(): number {return this.data.totalTime}

  /**
   * Fonction appelée pour afficher le travail (courant)
   */
  display(options: {[x: string]: any}){
    // Disptach des données
    this.dispatchData();
    // Réglage des boutons
    ui.showButtons({
      Start: true,
      Restart: false,
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
          case 'leftTime':
            return clock.time2horloge(v);
          case 'report':
            if ( v ) {
              return markdown(`---\n\n# ${t('ui.title.stop_report')}\n\n` + v);
            } else { return '' }
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
