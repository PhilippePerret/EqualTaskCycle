import type { RecType } from "../lib/types";
import { DGet } from "./js/dom";
import { marked } from 'marked';
import { ui } from "./ui";

const HELP_TEXTS: RecType = {
  
  introduction: `
### Introduction

Bienvenue dans l'aide modulaire de l'application ETC (Etcétéra) qui vous permet de travailler parallèlement plusieurs tâches.
`,


tasks_file: `
### Création d'un fichier de tâches

Pour fonctionner, vous avez besoin d'un fichier de tâches. Ce fichier doit être défini conformément au format décrit dans la section [Format du fichier des tâches](#tasks_file_format).
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
`
}


class Help {
  public static getInstance(){
    return this.inst || (this.inst = new Help());
  }
  private static inst: Help;

  private texts!: string[];

  public async show(helpIds: string[]){
    ui.toggleHelp();
    this.texts = helpIds.map((helpId: string) => {
      return `<a name="${helpId}"></a>\n\n` 
      + HELP_TEXTS[helpId]
      .trim()
      .concat("\n\n---")
    });
    this.timer = setInterval(this.writeText.bind(this), 500);
  }
  private timer?: NodeJS.Timeout;

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


  private get content(){
    return this._content || (this._content = DGet('div#help-content', DGet('section#help')) as HTMLDivElement);
  }; private _content!: HTMLDivElement;

  public init(){
    DGet('button.btn-close-help').addEventListener('click', this.close.bind(this));
  }
}

export const help = Help.getInstance();

help.init();