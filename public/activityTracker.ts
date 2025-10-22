import { Work } from "./client";
import { HOST } from "./js/constants";

export class ActivityTracker {

  // private static CHECK_INTERVAL = 15 * 60 * 1000;
  private static CHECK_INTERVAL = 10 * 1000;
  private static timer: NodeJS.Timeout | undefined;

  public static startControl(){
    this.timer = setInterval(this.control.bind(this), this.CHECK_INTERVAL)
  }

  public static stopControl(){
    clearInterval(this.timer);
    delete this.timer;
  }

  private static async control(){
    const response = await fetch(HOST + 'work/check-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectFolder: Work.currentWork.folder,
        lastCheck: Date.now() - this.CHECK_INTERVAL
      })
    });
      
    const result = await response.json();
    console.log("résultat du check:", result);

    //TODO POURSUIVRE
  }
}
