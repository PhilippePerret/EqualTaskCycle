import { Work } from "./work_client";
import { ui } from "./ui";
import { postToServer } from "./utils";

export class ActivityTracker /* CLIENT */ {

  // private static CHECK_INTERVAL = 15 * 60 * 1000;
  private static CHECK_INTERVAL = 5 * 60 * 1000;
  private static timer: NodeJS.Timeout | undefined;
  private static inactiveUser: boolean;

  public static startControl(){
    this.timer = setInterval(this.control.bind(this), this.CHECK_INTERVAL)
  }

  public static stopControl(){
    if (this.timer) {
      clearInterval(this.timer);
      delete this.timer;
    }
  }

  public static inactiveUserCorrection(workingTime: number): number {
    console.log("Working time : ", workingTime);
    if ( this.inactiveUser ) {
      console.log("Working time rectifié : ", workingTime - ((this.CHECK_INTERVAL / 2) / 1000))
      return workingTime - ((this.CHECK_INTERVAL / 2) / 1000);
    } else {
      return workingTime;
    }
  }

  private static async control(){
    const response = await postToServer('work/check-activity',{
        projectFolder: Work.currentWork.folder,
        lastCheck: Date.now() - this.CHECK_INTERVAL
    });
    const result = await response.json();
    console.log("résultat du check:", result);
    this.inactiveUser = result.userIsWorking === false;
    if (this.inactiveUser) { ui.onForceStop() }

  }
}
