import type { RecType } from "../lib/types";
import { DGet } from "./js/dom";
import { marked } from 'marked';
import { ui } from "./ui";
import { tt } from "../lib/Locale";

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
help(introduction, terminologie, task_list)
  `,
  
  introduction: `
### t(help.intro.title)

t(help.intro.text)
`,

  terminologie: `
### t(help.term.title)

*(D'abord un peu de terminologie pour bien comprendre l'aide)*

t(help.term.text)
  `,


task_list: `
### t(help.task_list.title)

t(help.task_list.text)
`,

tasks_file_format: `
### Format du fichier des tâches

Le fichier des tâches est un fichier YAML composé de cette manière simple :

    ---
    works:
      - id: travail1
        project: Le projet du travail
        content: Le contenu du travail à faire
      - id: travail2
        project: L'autre projet de l'autre travail
        content: Le contenu de son travail, ce qu'il y a à faire
      # etc.
`,

duree_cycle_vs_duree_sess: `
# t(help.durcycvsdursess.title)

t(help.durcycvsdursess.text)
`
}


class Help {
  public static getInstance(){return this.inst || (this.inst = new Help())}
  private static inst: Help;

  private texts!: string[];

  public async show(helpIds: string[]){
    this.isOpened() || ui.toggleHelp();
    this.texts = helpIds.map((helpId: string) => {
      let texte = HELP_TEXTS[helpId];
      // Est-ce un texte contenant d'autres textes d'aide ?
      if (texte.indexOf('help(')) {
        texte = texte.replace(/\bhelp\((.+?)\)/g, (_tout: string, liste: string) => {
          return liste.split(',').map((hid: string) => {
            hid = hid.trim();
            // console.log("Aide: %s", hid, HELP_TEXTS[hid]);
            return HELP_TEXTS[hid];
          }).join("\n\n");
        })
      }

      console.log("texte = ", texte);
      return `<a id="help-${helpId}" name="${helpId}"></a>\n\n` 
      + this.finalizeText(tt(texte))
      .trim()
      .concat("\n\n---")
    });

    this.timer = setInterval(() => {
      this.writeText.bind(this)();
      (DGet(`a#help-${helpIds[0]}`) as HTMLElement).scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 500);
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
    if ( (text = this.texts.shift()) ) {
      this.write(marked.parse(text) as string);
    } else {
      clearInterval(this.timer);
      delete this.timer;
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

  public init(){
    DGet('button.btn-close-help').addEventListener('click', this.close.bind(this));
  }
}

export const help = Help.getInstance();

help.init();
(window as any).help = help;