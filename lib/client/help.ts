import type { RecType } from "../shared/types";
import { DGet } from "../../public/js/dom";
import { ui } from "./ui";
import { tt, t } from "../shared/Locale";
import { markdown } from "../shared/utils_shared";
import { listenBtn } from "./utils";

/**
 * Module pour la gestion de l'aide
 * 
 * 
 * Pour un lien vers un texte d'aide dans l'aide utiliser :
 * 
 *  hlink(<titre>, <aide id dans HELP_TEXTS>)
 * 
 * (note : PAS de guillemets)
 * 
 */

const HELP_TEXTS: RecType = {

  // Résumé qu'on atteint depuis le message d'accueil
  resume_home_page: `
# t(help.introduction.title)

t(help.introduction.text)

# t(help.terminologie.title)

t(help.terminologie.text)

# t(help.deroulement_travail.title)

t(help.deroulement_travail.text)

# t(help.work_list.title)

t(help.work_list.text)
  `,
  
  introduction: `
### t(help.introduction.title)

t(help.introduction.text)
`,

  terminologie: `
### t(help.terminologie.title)

*(D'abord un peu de terminologie pour bien comprendre l'aide)*

t(help.terminologie.text)
  `,


work_list: `
### t(help.work_list.title)

t(help.work_list.text)
`,

work_data: `
### t(help.work_data.title)

t(help.work_data.text)
`,


duree_cycle_vs_duree_sess: `
# t(help.durcycvsdursess.title)

t(help.durcycvsdursess.text)
`,

stop_report: `
# t(help.stop_report.title)

t(help.stop_report.text)
`



}


class Help { /* singleton */
  private constructor(){}
  public static getInst(){return this.inst || (this.inst = new Help())}
  private static inst: Help;

  private texts!: string[];

  public async show(helpIds: string[]){
    this.isOpened() || ui.toggleHelp();
    this.content.innerHTML = '';
    // La liste helpIds va pouvoir être augmentée de
    // certaines aides nécessaires, appelées par exemple
    // par des liens. Il faut donc fonctionner tant 
    // qu'elle n'est pas vide.
    const LocIds: {type: string, locId: string, prefix?: string}[] = [];
    helpIds.forEach((helpId: string) => {
      LocIds.push({type: 'text', locId: helpId})
    })
    this.texts = [];
    let locDef: {type: string, locId: string, prefix?: string} | undefined; 
    while((locDef = LocIds.shift())) {
      // console.log("locDef = ", locDef);
      const locId = locDef.locId;
      const locIdpur = locId.replace(/\./g, '');
      let texte = HELP_TEXTS[locId] || t(locId);
      // console.log("TEXTE INI", texte);
      while(texte.match(/\bt\(/)) { texte = tt(texte) }
      // Est-ce un lien vers une autre partie de
      // l'aide ?
      if (texte.match(/help\((.+?)\)/)) {
        texte = texte.replace(/help\((.+?)\)/g, (_tout: string, hid: string) => {
          hid = hid.trim();
          console.log("HID = ", hid);
          const fullIdTitle = `help.${hid}.title`;
          const fullIdPrefix = t(`help.${hid}.level`);
          const fullIdText  = `help.${hid}.text`;
          LocIds.push({type: 'title', locId: fullIdTitle, prefix: fullIdPrefix});
          LocIds.push({type: 'text', locId: fullIdText});
          return `[*${t(fullIdTitle)}*](#help-${fullIdTitle.replace(/\./g, '')})`
        })
      }

      if (locDef.type === 'title') {
        texte = `${locDef.prefix} ${texte}`;
      } else {
        texte = `${texte}\n\n---`
      }

      // console.log("texte = ", texte);
      const formated_text = `<a id="help-${locIdpur}" name="${locIdpur}"></a>\n` 
      + this.finalizeText(texte).trim();

      // console.log("\n\n\nTEXTE AJOUTÉ : ", formated_text);
      this.texts.push(formated_text);
    };


    this.writeText.bind(this)();

    // this.timer = setInterval(() => {
    //   this.writeText.bind(this)();
    //   (DGet(`a#help-${helpIds[0]}`) as HTMLElement).scrollIntoView({behavior: 'smooth', block: 'start'});
    // }, 500);
  }
  private timer?: NodeJS.Timeout;

  private finalizeText(text: string): string {
    // Liens vers l'aide (hlink)
    text = text.replace(/\bhlink\((.+?)\)/g, (_tout: string, args: string) => {
      const [tit, hid] = args.split(',').map((s: string) => s.trim());
      return `<span onclick="help.show(['${hid}'])">${tit}</span>`;
    });
    return text;
  }

  private writeText(){
    var text: string | undefined;
    while ( (text = this.texts.shift()) ) {
      this.write(markdown(text) as string);
    }
  }

  private close(){ui.toggleHelp()}

  private write(text: string): boolean {
    this.content.insertAdjacentHTML('beforeend', text);
    return true;
  }

  private isOpened(){
    return !this.obj.classList.contains('hidden')
  }

  private get obj(){
    return this._obj || (this._obj = DGet('section#help'))
  }
  private _obj!: HTMLElement;

  private get content(){
    return this._content || (this._content = DGet('div#help-content', DGet('section#help')) as HTMLDivElement);
  }; private _content!: HTMLDivElement;

  public init(): boolean {
    DGet('button.btn-close-help').addEventListener('click', this.close.bind(this));
    listenBtn('help-toggle', this.show.bind(this, ['resume_home_page']));
    return true;
  }
}

export const help = Help.getInst();
(window as any).help = help;