import { Work } from "./work";
import { ui } from "./ui";
import { postToServer } from "../shared/utils";
import { Dialog } from "./Dialog";
import { t } from '../shared/Locale';
import log from 'electron-log/renderer';

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

  /**
   * Fonction qui appelle à intervalles réguliers le checker
   * pour voir si le travailleur travaille encore.
   * Dans le cas contraire, il lui affiche une fenêtre pour
   * confirmer ou dénier qu'il travaille encore.
   */
  private static async control(){
    log.info('-> ActivityTracker.control')
    const result = await postToServer('/work/check-activity',{
        projectFolder: Work.currentWork.folder,
        lastCheck: Date.now() - this.CHECK_INTERVAL
    });
    log.info(`Retour de control: ${JSON.stringify(result)}`);
    if (result.ok) {
      if (false === result.isActive) {
        // Le travailleur n'est pas actif, il faut lui demander
        // ce qu'il fait.
        log.info('--- Activer la fenêtre de demande d’activité ---');
        // @ts-ignore
        window.electronAPI.bringToFront();
        this.dialogActivity.show();
      }
    }
  }

  public static onChooseActivityState(isActive: boolean) {
    if (isActive === false) { ui.onForceStop() }
  }

  private static _dialactiv: Dialog;
  private static get dialogActivity(){
    return this._dialactiv || (this._dialactiv = new Dialog({
      title: t('ui.title.confirmation_required'),
      message: t('ui.text.are_you_still_working'),
      buttons: [
        {text: t('ui.button.not_anymore'), role: 'cancel', onclick: this.onChooseActivityState.bind(this, false)},
        {text: t('ui.button.yes_still'), role: 'default', onclick: this.onChooseActivityState.bind(this, true)}
      ],
      timeout: 120,
      onTimeout: this.onChooseActivityState.bind(this, false),
      icon: 'images/icon.png'
    }))
  }
}
