import { Work } from "./work";
import { ui } from "./ui";
import { postToServer } from "../shared/utils";

export class ActivityTracker /* CLIENT */ {

  // private static CHECK_INTERVAL = 15 * 60 * 1000;
  private static CHECK_INTERVAL = 3 * 60 * 1000; // test avec 1 minute
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
    const result = await postToServer('/work/check-activity',{
        projectFolder: Work.currentWork.folder,
        lastCheck: Date.now() - this.CHECK_INTERVAL
    });
    // console.log("résultat du check:", result);
    if (result.ok) {
      this.inactiveUser = result.userIsWorking === false;
      if (this.inactiveUser) { ui.onForceStop() }
    }

  }
}
