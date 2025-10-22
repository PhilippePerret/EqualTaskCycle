import { Work } from "./client";
import { HOST } from "./js/constants";
import { ui } from "./ui";

export class ActivityTracker /* CLIENT */ {

  // private static CHECK_INTERVAL = 15 * 60 * 1000;
  private static CHECK_INTERVAL = 10 * 1000;
  private static timer: NodeJS.Timeout | undefined;
  private static lastCheckTime: number;

  public static startControl(){
    this.timer = setInterval(this.control.bind(this), this.CHECK_INTERVAL)
  }

  public static stopControl(){
    if (this.timer) {
      clearInterval(this.timer);
      delete this.timer;
    }
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
    if (result.userIsWorking === false) {
      ui.onForceStop(this.lastCheckTime)
    } else {
      this.lastCheckTime = new Date().getTime();
    }

    //TODO POURSUIVRE
  }
}
