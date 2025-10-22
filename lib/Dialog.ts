/**
 * Une librairie pour "dialoguer" avec l'utilisateur (pour le moment 
 * seulement sur un Mac)
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
 * 
 * Documentation officielle Apple :
 *  https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html
 * Pour les options de displayDialog :
 *  https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html
 */

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

  constructor(
    private data:{
      title?: string,
      message: string,
      defaultAnswer?: string, // pour une demande
      buttons?: ButtonType[],
      timeout?: number,
      onTimeout?: Function,
      icon?: string
    }
  ){}

  async show(values: string[] | undefined = undefined){
    this._built || this.build();
    const detempCode = this.detemplatize(String(this.code), values);
    console.log("detempCode = ", detempCode);
    const retour = await Bun.$`osascript -l JavaScript -e ${detempCode}`;
    const dRes = retour.json();
    if (dRes.gaveUp) {
      console.log("Procédure abandonnée.");
      (this.data.onTimeout || this.fallbackOnTimeout)();
    } else {
      (this.tableButtons[dRes.buttonReturned] as any).onclick(dRes.textReturned);
    }
    // console.log("Retour:", retour);
    // let res = retour.text();
    // console.log("retour.text() = ", res);
    // res = retour.json();
    // console.log("retour.json() = ", JSON.stringify(res));

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
    this.analyseButtons();
    const o: string[] = [];
    o.push('const app = Application.currentApplication();');
    o.push('app.includeStandardAdditions = true;');
    o.push(`const res = app.displayDialog("${this.formatted_message}", {`);
    if (this.data.title){ o.push(`withTitle: "${this.formatted_title}",`)};
    if (this.data.timeout) { o.push(`givingUpAfter: ${this.data.timeout},`)};
    if (this.data.icon) { o.push(`withIcon: ${this.formatted_icon},`)};
    if (this.defaultButton) {
      o.push(`defaultButton: "${this.defaultButton}",`);
    }
    if ( this.cancelButton) {
      o.push(`cancelButton: "${this.cancelButton}",`);
    }
    o.push(`buttons: [${this.buttonList.map((b: string)=> `"${b}"`)}]`); // Pour terminer sans virgule
    o.push('});');
    o.push('JSON.stringify(res);')
    this.code = o.join("\n").replace(/'/g, "'\\''");
    this._built = true;
  }

  private analyseButtons(){
    const tblButtons: {[x: string]: ButtonType} = {};
    const boutons: string[] = [];
    // Boutons par défaut
    if (undefined === this.data.buttons) {this.data.buttons = this.fallbackButtons ;}
    this.data.buttons.forEach((bdata: ButtonType) => {
      if (bdata.default) { this.defaultButton = bdata.text; }
      else if (bdata.cancel) { this.cancelButton = bdata.text; }
      boutons.push(bdata.text);
      Object.assign(tblButtons, {[bdata.text]: bdata})
    }); // fin de boucle sur tous les boutons
    // Affectations
    this.tableButtons = tblButtons;
    this.buttonList = boutons;
  }

  private get formatted_message(): string{
    return this.commonReplacements(this.data.message);
  }
  private get formatted_title(): string {
    return this.commonReplacements(this.data.title as string);
  }

  private get formatted_icon(){
    const icon = this.data.icon || this.fallbackIcon;
    if (icon.match(/\//)) {
      return `Path("${icon}")`;
    } else {
      return icon;
    }
    
  }

  private commonReplacements(str: string): string {
    return str.replace(/'/g, '’');
  } 
}