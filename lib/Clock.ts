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

  
}