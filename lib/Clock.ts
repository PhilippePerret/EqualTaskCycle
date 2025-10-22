import { DGet } from "../public/js/dom";
import { ui } from "../public/ui";
import type { Work } from "../public/client";
import { Flash } from "../public/js/flash";

interface TimeSegment {
  beg: number;
  end?: number;
  laps?: number; // durée de ce segment
}

class Clock {
  public static getInstance(){return this._instance || (this._instance = new Clock())}
  private static _instance: Clock;
  private constructor(){}


  public time2horloge(mn: number) {
    let hrs = Math.floor(mn / 60);
    let mns = mn % 60;
    let horloge: string | string[] = [];
    horloge.push(`${hrs}`);
    horloge.push(`${mns>9?'':'0'}${mns}’`);
    // horloge.push('00');
    return horloge.join(' h ');
  }

  /**
   * Affectation du style de l'horloge
   * (3 tailles, de très gros à petit)
   */
  public setClockStyle(style: string){
    this.clockObj.classList.add(style);
  }

  private currentWork!: Work;
  private timer!: NodeJS.Timeout;
  private startTime!: number;
  private totalTime!: number;
  private currentTimeSegment!: TimeSegment;
  private timeSegments: TimeSegment[] = [];

  /**
   * Démarrage de l'horloge
   */
  public start(currentWork: Work){
    this.currentWork = currentWork;
    // console.log("Démarrage de l'horloge");
    this.timeSegments = [];
    this.clockObj.classList.remove('hidden');
    this.clockObj.innerHTML = '0:00:00';
    this.createTimeSegment();
    this.calcTotalRecTime();
    this.startTimer()
  }

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
    this.startTimer();
  }

  private startTimer(){
    this.startTime = new Date().getTime();
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  
  private createTimeSegment(){
    this.currentTimeSegment = {beg: new Date().getTime(), end: undefined, laps: undefined}
  }
  private endCurrentTimeSegment(){
    const end = new Date().getTime();
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
    this.clockObj.classList.add('hidden');
    return this.totalTime;
  }

  private run(){
    const secondesOfWork: number = this.totalTime + this.lapsFromStart();
    console.log("totalTime: %i | fromStart: %i", this.totalTime, this.lapsFromStart());
    this.clockObj.innerHTML = this.s2h(secondesOfWork);
    const restTime = this.taskRestTime(secondesOfWork);
    console.log("restTime = %i", restTime);
    if ( restTime < 10 && this.alerte10minsDone === false) {
      // 10 minutes restantes sur ce travail
      this.donneAlerte10mins();
    } else if (this.alerte10minsDone) {
      // L'alerte des 10 minutes a été donnée
      if (this.alerteWorkDone === false && restTime < 0) {
        // Temps de travail atteint, alerte pour avertir l'user
        this.donneAlerteWorkDone()
      }
    }
  }; 
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
    return this.currentWork.restTime - minutesOfWork;
  }

  private lapsFromStart(){
    return Math.round((new Date().getTime() - this.startTime) / 1000) ;
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

}

export const clock = Clock.getInstance();