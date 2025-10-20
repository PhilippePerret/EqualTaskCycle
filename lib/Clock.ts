import { DGet } from "../public/js/dom";

export class Clock {

  public static time2horloge(mn: number) {
    let hrs = Math.floor(mn / 60);
    let mns = mn % 60;
    let horloge: string | string[] = [];
    mns > 0 && horloge.push(`${mns} mns`);
    hrs > 0 && horloge.push(`${hrs} hrs`);
    if ( horloge.length ) {
      return horloge.join(' ');
    } else {
      return '---';
    }
  }

  /**
   * Affectation du style
   */
  public static setClockStyle(style: string){
    this.clockObj.classList.add(style);
  }

  /**
   * Démarrage de l'horloge
   */
  public static start(){
    // console.log("Démarrage de l'horloge");
    this.clockObj.classList.remove('hidden');
    this.clockObj.innerHTML = '0:00:00';
    this.startTime = new Date().getTime();
    this.timeLeft = 0;
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  private static timer: NodeJS.Timeout;
  private static startTime: number;
  private static timeLeft: number;

  public static pause(){
    clearInterval(this.timer);
    this.timeLeft += this.lapsFromStart()
  }
  public static stop(){
    clearInterval(this.timer);
    this.clockObj.classList.add('hidden');
  }

  private static run(){
    this.clockObj.innerHTML = this.s2h(this.timeLeft + this.lapsFromStart() );
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