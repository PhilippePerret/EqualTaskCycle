/**
 * Une librairie pour "dialoguer" avec l'utilisateur.
 * 
 * Usage
 * -----
 *  
 *  // Définition du dialogue
 *  const data = {
 *    message: "Le message affiché avec _0_ comme texte variable",
 *    title: "Le titre du message",
 *    buttons: [ // boutons dans l'ordre
 *      {text: "OK", onclick: <methode to call>},
 *      idem (ajouter 'default: true' pour le bouton par défaut et 
 *      'cancel: true' pour le bouton d'annulation)
 *    ],
 *    icon: '/path/to/icon.png',
 *    timeout: <nombre secondes>, // si la fenêtre doit se fermer toute seule
 *    onTimeout: <Function> // ce qu'il faut faire en cas de timeout
 *  }
 *  const dial = new Dialog(data);
 *  dial.show(["valeur pour _0_", "valeur pour _1_", etc.])
 *  // Attend et traite la réponse en fonction de +data+
 * 
 */
import log from 'electron-log/renderer';
import type { RecType } from '../shared/types';
import type { KeyboardEvent } from 'react';
import { stopEvent } from '../../public/js/dom';

type ButtonType = {
  text: string;
  onclick: Function;
  default?: boolean;
  cancel?: boolean;
}

export class Dialog {

  private _built: boolean = false;
  private code!: string;
  private tableButtons!: {[x: string]: ButtonType};
  private defaultButton!: string;
  private cancelButton?: string;
  private buttonList!: string[];
  // Valeurs de remplacement (aka par défaut)
  private fallbackButtons: ButtonType[] = [
    {text: "Cancel", onclick:()=>{}}, 
    {text: "OK", onclick: ()=>{}}
  ]
  private fallbackIcon: string = 'note';
  private fallbackOnTimeout: Function = ()=>{}
  private timer?: number;
  private cancelFunction?: Function; 
  private defaultFunction?: Function;
  private box!: HTMLDivElement; // La boite principale

  constructor(
    private data:{
      title?: string,
      message: string,
      defaultAnswer?: string, // pour une demande
      buttons: ButtonType[],
      timeout?: number,
      onTimeout?: Function,
      icon: string
    }
  ){}

  show(values: string[] | undefined = undefined){
    log.info('-> Dialog.show');
    this._built || this.build();
    const detempCode = this.detemplatize(String(this.code), values);
    this.box.classList.remove('hidden');
    this.courtcircuiteKeyboard();
    // On met en route un timeout s'il le faut
    if (this.data.timeout){
      this.timer = setTimeout(this.onTimeout.bind(this), this.data.timeout * 1000);
    }
    log.info('<- Dialog.show');
  }

  private close(){
    this.decourcircuiteKeyboard();
    this.box.classList.add('hidden');
  }

  onClickButton(callback: Function | undefined, ev?: MouseEvent){
    ev && stopEvent(ev);
    this.close();
    return callback && callback();
  }
  // Par raccourci clavier
  onCancel(){return this.onClickButton(this.cancelFunction)}
  onDefault(){return this.onClickButton(this.defaultFunction)}

  courtcircuiteKeyboard(){
    this._oldKeyDownFunction = (window as any).onkeydown;
    (window as any).onkeydown = (ev: KeyboardEvent) => {
      if (ev.code === 'Escape') {
        this.onCancel();
      } else if (ev.code === 'Enter') {
        this.onDefault();
      } 
      return false;
    }
  }
  decourcircuiteKeyboard(){
    (window as any).onkeydown = this._oldKeyDownFunction;
  }
  private _oldKeyDownFunction?: Function;


  onTimeout(ev: Event){
    clearTimeout(this.timer);
    delete (this as any).timer;
    (this.data.onTimeout || this.fallbackOnTimeout)();
  }

  detemplatize(code: string, values: string[] | undefined): string{
    if (values === undefined) {
      return code;
    } else {
      values.forEach((value: string, i: number) => {
        const reg = new RegExp(`_${i}_`, 'g');
        code = code.replace(reg, value)
      });
      return code;
    }
  }

  build(){
    log.info('-> Dialog.build()');
    
    const o = document.createElement('DIV') as HTMLDivElement;
    o.className = 'dialog hidden';
    if (this.data.title) {
      const t = document.createElement('DIV');
      t.className = 'dialog-title';
      t.innerHTML = this.formatted_title;
      o.appendChild(t);
    }
    const m = document.createElement('DIV');
    m.className = 'dialog-message';
    m.innerHTML = this.formatted_message;
    o.appendChild(m);
    const i = document.createElement('IMG');
    i.className = 'dialog-icon';
    o.appendChild(i);
    i.setAttribute('src', this.data.icon);
    const bts = document.createElement('DIV');
    bts.className = 'buttons';
    o.appendChild(bts);
    this.data.buttons.forEach((bouton: RecType) => {
      const b = document.createElement('BUTTON');
      b.innerHTML = bouton.text;
      b.addEventListener('click', this.onClickButton.bind(this, bouton.onclick));
      if (bouton.default === true) {
        this.defaultFunction = bouton.onclick;
        b.classList.add('default');
      } else if (bouton.cancel === true) {
        this.cancelFunction = bouton.onclick;
        b.classList.add('cancel');
      }
      bts.appendChild(b);
    })
    log.info('<- Dialog.build()');
    this.box = o;
    document.body.appendChild(this.box);
    this._built = true;
  }

  private get formatted_message(): string{
    return this.commonReplacements(this.data.message);
  }
  private get formatted_title(): string {
    return this.commonReplacements(this.data.title as string);
  }

  private commonReplacements(str: string): string {
    return str
      .replace(/'/g, '’')
      .split("\n\n")
      .map(s => `<p>${s}</p>`)
      .join('');
  } 
}