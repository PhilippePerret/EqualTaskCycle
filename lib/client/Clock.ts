import { DGet } from "../../public/js/dom";
import { ui } from "./ui";
import { Work } from "./work";
import { Flash } from "../../public/js/flash";

interface TimeSegment {
  beg: number;
  end?: number;
  laps?: number; // durée de ce segment
}

type CounterModeType = 'clock' | 'countdown'


class Clock {

  public static getInstance(){return this._instance || (this._instance = new Clock())}
  private static _instance: Clock;
  private constructor(){}

  private counterMode!: CounterModeType ;

  // Reçoit des minutes est retourne "x h y’"
  public time2horloge(mn: number) {
    let hrs = Math.floor(mn / 60);
    let mns = Math.round(mn % 60);
    let horloge: string | string[] = [];
    horloge.push(`${hrs}`);
    horloge.push(`${mns>9?'':'0'}${mns}’`);
    // horloge.push('00');
    return horloge.join(' h ');
  }
  public mn2h(mn: number){return this.time2horloge(mn)}

  private get clockContainer(){
    return this._clockcont || (this._clockcont = DGet('div#clock-container'))
  }; 
  private _clockcont?: HTMLDivElement;

  /**
   * Affectation du style de l'horloge
   * (3 tailles, de très gros à petit)
   */
  public setClockStyle(style: string){
    ['mini', 'medium', 'big'].forEach((sty: string) => {
      if (sty === style) { this.clockContainer.classList.add(style)}
      else { this.clockContainer.classList.remove(sty)}
    })
  }
  /**
   * Affectation du mode de comptage, en mode "horloge" (défilage
   * normal du temps) ou en mode "compte à rebours" (défilage du
   * temps à rebours à partir du temps restant)
   */
  public setCounterMode(mode: CounterModeType = 'clock'){
    this.counterMode = mode;
  }

  private currentWork!: Work;
  private timer!: NodeJS.Timeout;
  private startTime!: number;
  private totalTime!: number;
  private currentTimeSegment!: TimeSegment;
  private timeSegments: TimeSegment[] = [];

  private getTime(){ return Math.round(new Date().getTime() / 1000) }

  /**
   * Démarrage de l'horloge
   */
  public start(currentWork: Work){
    this.currentWork = currentWork;
    // console.log("Démarrage de l'horloge");
    this.timeSegments = [];
    this.clockContainer.classList.remove('hidden');
    this.clockObj.innerHTML = this.startClockPerCounterMode();
    this.createTimeSegment();
    this.calcTotalRecTime();
    this.startTimer()
  }

  private startClockPerCounterMode(): string {
    if (this.counterMode === 'clock') {
      return '0:00:00';
    } else {
      return this.s2h(this.currentWork.leftTime * 60);
    }
  }

  private get totalRestTimeSeconds(){
    return this._totresttime || (this._totresttime = this.currentWork.leftTime * 60)
  }; private _totresttime!: number;

  /**
   * Calcul du temps complet de travail depuis le lancement de la 
   * tâche, en sachant que ce travail peut être interrompu (mis en
   * pause). Donc le temps total est enregistré en consignant chaque
   * tranche de temps travaillée.
   */
  private calcTotalRecTime(): void {
    this.totalTime = this.timeSegments
      .filter((segTime: TimeSegment) => !!segTime.laps)
      .reduce(
      (accu: number, segTime: TimeSegment) => accu + (segTime.laps as number),
      0
    );
  }

  /**
   * Redémarre un travail mis en pause
   */
  public restart(){
    this.createTimeSegment();
    this.clockContainer.classList.remove('hidden');
    this.startTimer();
  }

  private startTimer(){
    this.startTime = this.getTime() ;
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  
  private createTimeSegment(){
    this.currentTimeSegment = {beg: this.getTime(), end: undefined, laps: undefined}
  }
  private endCurrentTimeSegment(){
    const end = this.getTime();
    const laps = end - this.currentTimeSegment.beg;
    Object.assign(this.currentTimeSegment, {end: end, laps: laps});
    this.timeSegments.push(this.currentTimeSegment);
    delete (this as any).currentTimeSegment;
    this.calcTotalRecTime(); // update this.totalTime
  }

  public getStartTime(){ return this.startTime; }

  public pause(){
    this.endCurrentTimeSegment();
    clearInterval(this.timer);
  }

  /**
   * @api
   * 
   * Fonction appelée pour interrompre l'horloge.
   * 
   * @returns Temps total de travail
   */
  public stop(): number {
    clearInterval(this.timer);
    delete (this as any).timer;
    this.endCurrentTimeSegment();
    this.clockContainer.classList.add('hidden');
    return this.totalTime;
  }

  private run(){
    const secondesOfWork: number = this.totalTime + this.lapsFromStart();
    // console.log("totalTime: %i | fromStart: %i", this.totalTime, this.lapsFromStart());
    let displayedSeconds: number;
    if (this.counterMode === 'clock') { displayedSeconds = secondesOfWork}
    else /* countdown */ { displayedSeconds = this.totalRestTimeSeconds - secondesOfWork}
    const leftTime = this.taskRestTime(secondesOfWork);
    /****************************************
     * AFFICHAGE DU TEMPS DANS L'INTERFACE  *
     ****************************************/
    // L'horloge principale
    this.clockObj.innerHTML = this.s2h(displayedSeconds);
    // Les temps du travail (seulement si la "minute" a changé)
    if (secondesOfWork % 60 === 0) {
      const thisMinute = Math.round(secondesOfWork / 60);
      const elapsedMinutes = this.currentWork.cycleTime + thisMinute;
      const totalMinutes = this.currentWork.totalTime + thisMinute;
      this.restTimeField.innerHTML  = this.time2horloge(leftTime);
      this.cycleTimeField.innerHTML = this.time2horloge(elapsedMinutes);
      this.totalTimeField.innerHTML = this.time2horloge(totalMinutes);
    }
    /****************************************/
    // console.log("leftTime = %i", leftTime);
    if ( leftTime < 10 && this.alerte10minsDone === false) {
      // 10 minutes restantes sur ce travail
      this.donneAlerte10mins();
    } else if (this.alerte10minsDone) {
      // L'alerte des 10 minutes a été donnée
      if (this.alerteWorkDone === false && leftTime < 0) {
        // Temps de travail atteint, alerte pour avertir l'user
        this.donneAlerteWorkDone()
      }
    }
  }; 
  private get restTimeField(){
    return this._restfield || (this._restfield = DGet('span#current-work-leftTime'))
  }
  private get cycleTimeField(){
    return this._cycledurfield || (this._cycledurfield = DGet('span#current-work-cycleTime'))
  }
  private get totalTimeField(){
    return this._totalfield || (this._totalfield = DGet('span#current-work-totalTime'))
  }

  private alerte10minsDone: boolean = false;
  private alerteWorkDone: boolean = false;

  private donneAlerte10mins(){
    ui.setBackgroundColorAt('orange');
    this.bringAppToFront();
    Flash.notice("10 minutes of work remaining");
    this.alerte10minsDone = true;
  }
  private donneAlerteWorkDone(){
    this.bringAppToFront();
    Flash.notice('Work time is over. Please move on to the next task.');
    this.alerteWorkDone = true;
  }

  /**
   * Retourne le nombre de minutes restantes avant la fin.
   * Attention, la méthode est appelée toutes les demi-secondes.
   */
  private taskRestTime(minutesOfWork: number): number {
    minutesOfWork = minutesOfWork / 60;
    return this.currentWork.leftTime - minutesOfWork;
  }

  private lapsFromStart(){
    return Math.round(this.getTime() - this.startTime) ;
  }

  private get clockObj() {
    return this._clockobj || (this._clockobj = DGet('#clock') as HTMLDivElement);
  } private _clockobj!: HTMLDivElement;


  public s2h(s: number){
    let h: number = Math.floor(s / 3600)
    s = s % 3600
    let m: number | string = Math.floor(s / 60)
    const mstr = m < 10 ? `0${m}` : String(m) ;
    s = s % 60
    const sstr: string = s < 10 ? `0${s}` : String(s) ;
    return `${h}:${mstr}:${sstr}`
  }

  private bringAppToFront(){
    (window as any).electronAPI.bringToFront();
  }

  private _restfield!: HTMLSpanElement;
  private _cycledurfield!: HTMLSpanElement;
  private _totalfield!: HTMLSpanElement;
}

export const clock = Clock.getInstance();