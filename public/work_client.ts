import { clock } from "../lib/Clock.js";
import type { RecType, RunTimeInfosType, WorkType } from "../lib/types.js";
import { HOST } from "./js/constants.js";
import { DGet } from "./js/dom.js";
import { Flash } from "./js/flash.js";
import { ui } from "./ui.js";
import { prefs } from "./prefs.js";
import { help } from "./help.js";
import { editor } from "./editing.js";
import { EndWorkReport } from "./end_work_report.js";
import { markdown, postToServer } from "./utils.js";

export class Work {

  public static async init(){
    const res = await this.getCurrent();
    if (res === true) {
      prefs.init();
      editor.init();
      Flash.notice(`App is ready. <span id="mes123">(Show help)</span>`)
      DGet('span#mes123').addEventListener('click', 
        help.show.bind(help, ['introduction', 'tasks_file', 'tasks_file_format']),
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
    // if ( time ) {
    if ( true ) {
      await this.currentWork.addTimeAndSave(time)
    } else {
      Flash.error("Too short time to be saved.")
    }
  }


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
      this.data.startedAt = clock.getStartTime();
    }
    this.data.lastWorkedAt = clock.getStartTime();
    const stopReport = await new EndWorkReport(this).writeReport();
    if (stopReport === undefined) { return false /* annulation */}
    this.data.report = stopReport as string;
    console.log("[addTimeAndSave] Enregistrement des temps et du rapport", this.data);
    const result: RecType = await postToServer('work/save-session', this.data);
    console.log("Retour save session: ", result);
    // On actualise l'affichage pour apercevoir les nouveaux temps
    // pendant 2 secondes puis on passe à la tâche suivante, qui a
    // été remontée.
    this.dispatchData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    Work.displayWork(result.next, result.options);
    if (result.ok) { Flash.success("New times saved.");}
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
    const retour: RecType = await fetch(HOST + 'task/current')
    .then(r => r.json() as RecType);
    console.log("retour:", retour);
    prefs.setData(retour.prefs);
    clock.setClockStyle(retour.prefs.clock);
    clock.setCounterMode(retour.prefs.counter);
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
    // console.log("this.data", this.data);
  }

  public get id(){ return this.data.id; }
  public get script(): string | undefined {return this.data.script}
  public get folder(): string | undefined {return this.data.folder}
  public get restTime(): number {return this.data.restTime}
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
    this.data.content += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eros velit, mattis vitae felis vitae, venenatis euismod libero. Nulla hendrerit, sem in tincidunt sodales, libero nibh lobortis sapien, eget imperdiet est ante non risus. Aenean sagittis eleifend risus, non maximus quam placerat ut. Nunc diam mi, eleifend a mauris ut, aliquet lobortis diam. Duis venenatis sed enim at bibendum. Integer ornare vulputate erat eget blandit. Sed pulvinar odio diam, ornare sollicitudin diam ullamcorper et. Aliquam nec ipsum nisl. Praesent quis risus euismod, scelerisque ligula vitae, semper erat. Nunc volutpat odio bibendum orci egestas, at mattis dolor fringilla. Nam interdum congue neque, nec feugiat diam sagittis sed. Aenean mauris risus, scelerisque at libero vitae, egestas auctor odio. Suspendisse eget orci at ipsum lobortis efficitur et ac ante.

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus sem magna, lacinia non lorem ut, faucibus dignissim mi. Morbi bibendum, nibh vitae accumsan ornare, eros est viverra purus, quis facilisis dui ligula vel diam. Aenean faucibus scelerisque sapien, vel dictum erat dapibus in. Suspendisse vel urna pulvinar, aliquam erat sed, dapibus lacus. Donec eleifend dolor leo, et vulputate nunc placerat tempor. Duis sit amet ultricies tellus. Aenean velit metus, volutpat eu lorem at, placerat eleifend mauris. Proin accumsan erat a libero dignissim, in posuere ante lobortis. Cras arcu tellus, tempor a suscipit vel, convallis vel eros. Vestibulum eleifend semper accumsan.

Nam accumsan arcu venenatis leo porta, vitae consequat sapien faucibus. Quisque sed lorem vitae sem placerat commodo non a justo. Aliquam eleifend tortor eget viverra luctus. Mauris vel faucibus libero, id semper nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vehicula purus ac bibendum dictum. Etiam justo justo, varius eu venenatis nec, ultricies nec elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum vitae ipsum eget ipsum tristique ullamcorper sed at ante. Sed consequat tellus orci, in rhoncus velit efficitur et.

Vestibulum vitae lectus id est convallis placerat. Quisque efficitur, lorem at efficitur blandit, neque libero aliquam risus, a rutrum libero neque ut purus. Curabitur massa tortor, facilisis ac lobortis in, consequat eu diam. Sed tincidunt leo sed sagittis tincidunt. Mauris semper velit justo. Donec lacinia odio a porttitor cursus. Proin magna nunc, porttitor sit amet pellentesque ac, sodales vehicula arcu. Donec pretium tincidunt metus vitae rhoncus. Morbi ex massa, gravida id est vel, molestie tempor lectus. Praesent rhoncus, tellus vitae finibus ullamcorper, sapien dui rhoncus ex, at sodales mauris metus quis augue. Maecenas condimentum posuere leo, in tempor odio euismod in. Mauris in velit nec nibh laoreet interdum vel vel erat. Praesent maximus mattis leo id semper.

Phasellus eu ipsum vel mauris bibendum scelerisque nec vitae nibh. Curabitur eu maximus nisl, eget sagittis odio. Maecenas ac nunc volutpat, vestibulum nibh et, auctor enim. Donec efficitur volutpat lectus, eu pretium felis sollicitudin a. In convallis libero nunc, at cursus enim ornare nec. Nunc ut feugiat lacus. Sed ac sapien imperdiet, sollicitudin justo sed, ullamcorper diam. Phasellus accumsan iaculis risus nec vulputate. In molestie et dolor et volutpat. Mauris vitae diam ultrices, lacinia ligula tincidunt, mollis elit. Donec convallis euismod nisi, sit amet sagittis ex suscipit ut. Fusce quis mauris lorem. Quisque ex orci, eleifend a nunc id, pulvinar posuere ante. Phasellus iaculis ornare massa, eu pharetra odio consequat id.

Donec nisl mi, suscipit quis convallis non, commodo sed odio. Nullam ut rutrum libero, at feugiat sem. Nam congue leo ut ligula convallis, eget pretium lectus vehicula. Cras eget facilisis nisi. Fusce semper tempus viverra. Nullam ultrices felis id sollicitudin ullamcorper. Fusce fermentum massa tempus, pretium arcu at, porttitor nunc. Sed sed lacus magna. Donec ipsum magna, laoreet ut placerat vel, ultrices sit amet elit.

Vivamus pharetra ipsum ornare nisi lacinia porta. Praesent est lacus, iaculis id tincidunt sit amet, tempor ornare libero. Vestibulum vel tellus viverra, aliquam lacus in, congue risus. Aliquam eget mi pretium nulla viverra auctor. Donec eu scelerisque urna. Donec quis lectus id turpis mollis gravida. Ut placerat ullamcorper cursus. Nunc suscipit ac lorem at hendrerit. Ut at dui quis risus egestas consequat ut et odio. Mauris sagittis luctus neque vitae vestibulum.

Nulla nec facilisis dui. Suspendisse potenti. Suspendisse vestibulum erat nulla, rhoncus imperdiet sapien condimentum id. Praesent venenatis orci id facilisis rhoncus. Sed purus erat, iaculis quis consequat eget, ullamcorper eu massa. Integer tempus maximus augue at elementum. Suspendisse non tellus vulputate, malesuada mi id, euismod felis. Pellentesque maximus, quam id tincidunt facilisis, ex ipsum tincidunt leo, in feugiat nibh elit id lectus. Praesent dignissim libero et arcu dignissim tincidunt. Nulla ac laoreet metus.

Ut massa mauris, aliquet semper velit nec, volutpat sagittis lectus. Suspendisse gravida orci eu dui convallis malesuada. Praesent in tempor tortor, eget tempor lorem. Nullam nisl arcu, eleifend gravida efficitur sit amet, malesuada at nisl. Vestibulum porta rutrum imperdiet. Pellentesque varius tortor libero, vitae sagittis libero auctor at. Duis tincidunt, nibh ut condimentum ullamcorper, lorem enim scelerisque odio, sed vestibulum magna tellus vel metus. Aliquam et tellus in ipsum maximus consequat. Pellentesque tempor dictum enim, tempor sodales nibh iaculis sed. Nulla dapibus, nulla a pellentesque mattis, ipsum leo fringilla dui, ac euismod mauris tortor sed quam. Donec porta dui quis lacus commodo, non malesuada urna aliquam. Morbi quis erat tellus. Pellentesque nunc lorem, pellentesque molestie tempor a, tincidunt id ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean vehicula vehicula sem.

Mauris sed velit sed ante molestie porta et hendrerit turpis. Vestibulum commodo erat lorem, a malesuada nibh vulputate vitae. Duis sit amet finibus diam. Sed id euismod nisl. Aenean rutrum nisi non lacus congue rhoncus et non diam. Pellentesque at elit sed nunc commodo dictum sit amet eu odio. Praesent in malesuada lacus, vel egestas ante. Maecenas sit amet massa lacinia, ornare sem commodo, vulputate ante.`

    Object.entries(this.data).forEach(([k, v]) => {
      v = ((prop: string, v: any) => {
        switch(prop){
          case 'totalTime': 
          case 'cycleTime':
          case 'restTime':
            return clock.time2horloge(v);
          case 'report':
            if ( v ) {
              return markdown("---\n\n# Last Session Report\n\n" + v);
            } else { return v }
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
