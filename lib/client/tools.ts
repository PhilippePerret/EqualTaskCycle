import { t } from "../shared/Locale.js";
import { DGet, stopEvent } from "../../public/js/dom.js";
import { Flash } from "../../public/js/flash.js";
import { ui } from "./ui";
import { markdown, postToServer } from "../shared/utils.js";
import { Work } from "./work.js";
import { prefs } from "./prefs.js";
import type { RecType } from "../shared/types.js";
import { Panel } from "./Panel.js";
import { clock } from "./Clock.js";

interface ToolType {
  name: string;
  method: EventListener;
  description: string;
}

class Tools { /* singleton */

  private get TOOLS_DATA(): ToolType[] { return [
    {
      name: t('ui.tool.times_report.name'),
      description: t('ui.tool.times_report.desc'),
      method: this.tasksReportDisplay.bind(this)
    },
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
    await postToServer('/manual/open', {lang: prefs.getLang()});
  }

  // --- //

  private async produceManual(ev: Event){
    stopEvent(ev);
    const retour = await postToServer('/manual/produce', {lang: prefs.getLang()});
    if (retour.ok) { Flash.success(t('manual.produced')) }
  }

  // --- //

  /**
   * Affichage du rapport de temps.
   */
  private async tasksReportDisplay(ev: Event){
    stopEvent(ev);
    const retour = await postToServer('/tasks/get-all-data', {process: 'times_report tool', dataPath: prefs.getFile()});
    if (retour.ok) {
      console.log("RETOUR: ", retour);
      let tableau: string | string[] = []
      tableau.push([t('ui.thing.Work'), `${t('ui.thing.Cycle')}<sup>1</sup>`, `${t('ui.title.worked')}<sup>2</sup>`, `${t('ui.title.left')}<sup>3</sup>`, `${t('ui.title.total')}<sup>4</sup>`].join(' | '))
      tableau.push(['---', ':---:', ':---:', ':---:', ':---:'].join(' | '));
      retour.times.forEach((dtimes: RecType) => {
        const idw = dtimes.id;
        const wdata = retour.data[idw];
        if (Number(wdata.active) === 0) { return }
        const line = [
          wdata.name, 
          clock.mn2h(dtimes.defaultLeftTime),
          clock.mn2h(dtimes.defaultLeftTime - dtimes.leftTime),
          clock.mn2h(dtimes.leftTime),
          clock.mn2h(dtimes.totalTime)
        ].join (' | ');
        (tableau as string[]).push(line)
      });
      (tableau as string[]).push(' | | | | ');
      tableau = tableau.map(line => `| ${line} |`).join("\n");
      tableau = markdown(tableau);
      tableau += `
      <div style="margin-top:2em">
      <sup>1</sup> ${t('help.times.duree_cycle')}<br />
      <sup>2</sup> ${t('help.times.duree_worked')}<br />
      <sup>3</sup> ${t('help.times.duree_left')}<br />
      <sup>4</sup> ${t('help.times.duree_totale')}<br />
      </div>
      `.replace(/^\s+/gm, '');
      // console.log("tableau", tableau);
      if (undefined === this.TimesReportPanel) {
        this.TimesReportPanel = new Panel({
          title: t('ui.title.times_report'),
          buttons: 'ok',
          content: tableau
        })
      } else {
        this.TimesReportPanel.setContent(tableau);
      }
      this.TimesReportPanel.show();
    };  
  }
  private TimesReportPanel!: Panel;
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