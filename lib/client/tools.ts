import { t } from "../shared/Locale.js";
import { DGet, stopEvent } from "../../public/js/dom.js";
import { Flash } from "../../public/js/flash.js";
import { ui } from "./ui";
import { postToServer } from "../shared/utils.js";
import { Work } from "./work.js";
import { prefs } from "./prefs.js";

interface ToolType {
  name: string;
  method: EventListener;
  description: string;
}

class Tools { /* singleton */

  private get TOOLS_DATA(): ToolType[] { return [
    {
      name: t('ui.tool.reset_cycle.name'), 
      description: t('ui.tool.reset_cycle.desc'), 
      method: this.resetCycle.bind(this)
    },
    {
      name: t('ui.tool.manual.open.name'),
      description: t('ui.tool.manual.open.desc'),
      method: this.openManual.bind(this)
    },
    {
      name: t('ui.tool.manual.produce.name'),
      description: t('ui.tool.manual.produce.desc'),
      method: this.produceManual.bind(this)
    }
  ]}

  // -------- TOOLS ----------

  /* Client-side */
  private async resetCycle(ev: Event) {
    ev && stopEvent(ev);
    const retour = await postToServer('/tool/reset-cycle', {process: t('ui.tool.reset_cycle.name')});
    if (retour.ok){
      Flash.success(t('tool.cycle_reset'))
      ui.toggleSection('work');
      await Work.getCurrent();
    }
  }

  // --- //

  private async openManual(ev: Event){
    stopEvent(ev);
  }

  // --- //

  private async produceManual(ev: Event){
    stopEvent(ev);
    const retour = await postToServer('/manual/produce', {lang: prefs.getLang()})
    if (retour.ok) { Flash.success(t('manual.produced')) }
  }

  // -------- /TOOLS ----------


  /**
   * Construction de la section des outils
   * (seulement si on ouvre le panneau — cf. Prefs)
   */
  build(): void {
    if (this.built) { return }
    const cont = this.container;
    this.TOOLS_DATA.forEach((dtool: ToolType) => {
      const o = document.createElement('DIV');
      o.className = 'tool-container';
      const a = document.createElement('A');
      a.innerHTML = dtool.name;
      const d = document.createElement('DIV');
      d.innerHTML = dtool.description;
      d.className = 'explication'
      o.appendChild(a);
      o.appendChild(d);
      cont.appendChild(o)
      // Observation
      a.addEventListener('click', dtool.method);
    })
    this.built = true;
  }
  
  private get container(){return DGet('#tools-container')}
  private built: boolean = false;

   /* singleton */
  public static getInstance(){return this.inst || (this.inst = new Tools())}
  private constructor(){};
  private static inst: Tools;
}

export const tools = Tools.getInstance();