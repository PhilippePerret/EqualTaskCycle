import type { Work } from "../work_client";
import { listenBtn } from "../utils";
import { DGet, stopEvent } from "./dom";
import { Flash } from "./flash";

/**
 * RAPPORT DE FIN DE TÂCHE (ET DE DÉBUT DE TÂCHE FUTURE)
 * 
 * Avant d'aller enregistrer le temps après un STOP de la tâche,
 * on présent à l'utilisateur une fenêtre qui lui permet d'indiquer
 * ce qu'il y aura à faire au prochain cycle sur la tâche, pour
 * reprendre le travail plus rapidement et plus efficacement.
 * 
 * C'est cette partie qui gère ça, en permettant même de proposer
 * des questions à l'utilisateur pour savoir ce qu'il doit écrire
 * (car ce n'est jamais facile). Par exemple, d'indique le nom du
 * fichier qui sera consulté en priorité par rapport à la tâche
 * à poursuivre ou à commencer.
 */
export class EndWorkReport {

  private inited: boolean = false;

  constructor(
    private work: Work
  ){}

  /**
   * @api
   * 
   * Ouvre la boite de rapport de fin de travail pour le remplir.
   * 
   */
  public open(){
    this.inited || this.init();
    this.reset();
    this.show();
  }

  /**
   * Pour enregistrer le rapport 
   * (normalement, ça doit être fait avec l'enregistrement du temps)
   */
  onSave(ev: MouseEvent){
    return ev && stopEvent(ev);
  }

  onDontSave(ev: MouseEvent){
    return ev && stopEvent(ev);
  }

  /**
   * Applique le template dans le champ de rédaction.
   * 
   * TODO Plus tard, pouvoir définir des templates soi-même et les 
   * choisir.
   */
  onTemplate(ev: MouseEvent): boolean {
    if ( this.getContent().length ) {
      Flash.error('Empty content before apply template. (prudence)')
    } else {
      // TODO Pouvoir choisir parmi les templates proposé
      this.setContent(this.TEMPLATES[0] as string);
    }
    return ev && stopEvent(ev);
  }

  private getContent(){return this.contentField.value;}
  private setContent(s: string){this.contentField.value = s;}

  private init(){
    this.contentField.setAttribute('placeholder', `
      Description de ce qu'il faudra faire à la prochaine session.

      En précisant bien les points importants, les choses à noter, les implémentations particulières du projet, surtout s'il s'agit de programmation.
      `.replace(/^ +/gm, '').trim());
    DGet('#ETR-explication', this.obj).innerText = 'Ce rapport doit servir à commencer la prochaine session de travail plus rapidement et plus efficacement. C’est votre baton de relais pour la prochaine session.'
    this.observeButtons();
  }
  private observeButtons(){
    listenBtn('etr-save', this.onSave.bind(this));
    listenBtn('etr-dont-save', this.onDontSave.bind(this));
    listenBtn('etr-template', this.onTemplate.bind(this));
  }
  private reset(){
    this.contentField.value = '';
  }

  /**
   * Méthode affichant la fenêtre pour entrer le rapport
   */
  private show(){
    this.obj.classList.remove('hidden');
  }
  private hide(){
    this.obj.classList.add('hidden');
  }

  private id!: string;
  

  private get contentField(){
    return this._contfield || (this._contfield = DGet('textarea#ETR-report', this.obj));
  }

  private get obj(){
    return this._obj || (this._obj = DGet('div#ETR-container'))
  }


  private _contfield!: HTMLTextAreaElement;
  private _obj!: HTMLDivElement;



  TEMPLATES = [
    `
    *(Taking up the baton for the next work session)*
    ## Main Goal : 

    ## Main Tasks :
    - 
    -
    -

    ## Main Usefull Files :
    - 
    - 
    - 

    ## Remarque
    *(mind about this)*

    ## Config Note
    *(note about curren config or situation)*

    `
  ]
}