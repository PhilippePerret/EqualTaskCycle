import { DGet } from "../public/js/dom";
import { ui } from "../public/ui";
import type { Work } from "../public/client";

export class Clock {

  public static time2horloge(mn: number) {
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
  public static setClockStyle(style: string){
    this.clockObj.classList.add(style);
  }

  private static currentWork: Work;
  private static timer: NodeJS.Timeout;
  private static startTime: number;
  private static timeLeft?: number;
  private static totalTime: number;

  /**
   * Démarrage de l'horloge
   */
  public static start(currentWork: Work){
    this.currentWork = currentWork;
    // console.log("Démarrage de l'horloge");
    this.clockObj.classList.remove('hidden');
    if ( undefined === this.timeLeft ) {
      // La toute toute première fois
      this.timeLeft = 0;
      this.clockObj.innerHTML = '0:00:00';
    }
    this.startTime = new Date().getTime();
    this.timer = setInterval(this.run.bind(this), 1000);
  }

  public static getStartTime(){ return this.startTime; }

  public static pause(){
    clearInterval(this.timer);
    (this.timeLeft as number) += this.lapsFromStart()
  }
  public static stop(): number {
    clearInterval(this.timer);
    this.totalTime = (this.timeLeft as number) + this.lapsFromStart();
    this.timeLeft = undefined;
    this.clockObj.classList.add('hidden');
    return this.totalTime;
  }

  private static run(){
    const secondesOfWork: number = (this.timeLeft as number) + this.lapsFromStart()
    this.clockObj.innerHTML = this.s2h(secondesOfWork);
    // Si le temps restant est inférieur à 10 minutes et que
    // l'alerte n'a pas été donnée, on signale la fin imminente
    // par un changement de couleur
    if ( this.taskRestTime(secondesOfWork / 60) < 10 && this.alerte10minsDone === false) {
      this.donneAlerte10mins();
      this.alerte10minsDone = true;
    }
  }; 
  private static alerte10minsDone: boolean = false;

  private static donneAlerte10mins(){
    ui.setBackgroundColorAt('orange');
  }

  /**
   * Retourne le nombre de minutes restantes avant la fin.
   * Attention, la méthode est appelée toutes les demi-secondes.
   */
  private static taskRestTime(minutesOfWork: number): number {
    return this.currentWork.restTime - minutesOfWork;
  }

  private static lapsFromStart(){
    return Math.round((new Date().getTime() - this.startTime) / 1000) ;
  }

  private static get clockObj() {
    return this._clockobj || (this._clockobj = DGet('#clock') as HTMLDivElement);
  } private static _clockobj: HTMLDivElement;


  public static s2h(s: number){
    let h: number = Math.floor(s / 3600)
    s = s % 3600
    let m: number | string = Math.floor(s / 60)
    const mstr = m < 10 ? `0${m}` : String(m) ;
    s = s % 60
    const sstr: string = s < 10 ? `0${s}` : String(s) ;
    return `${h}:${mstr}:${sstr}`
  }

}