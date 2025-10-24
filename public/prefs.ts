import { clock } from "../lib/Clock";
import type { PrefsDataType, RecType } from "../lib/types";
import { DGet, stopEvent } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";
import { listenBtn, postToServer } from "./utils";


export class Prefs {

  private data!: PrefsDataType;
  private fieldsReady: boolean = false;

  private static instance: Prefs;
  private constructor(){}
  public static getInstance(){
    return this.instance || (this.instance = new Prefs())
  }

  public init(){
    this.observeButtons();
  }

  /**
   * Pour ouvrir le fichier des données
   */
  async onOpenDataFile(ev: MouseEvent){
    stopEvent(ev);
    const result = await postToServer('prefs/open-data-file', {
      filePath: this.getValue('file')
    })
    if (result.ok) { Flash.success('File open with success.') } 
    else { Flash.error('An error occured: ' + result.error) }
  }

  /**
   * Fonction appelée pour sauver les données de préférence
   */
  async onSave(ev: MouseEvent){
    stopEvent(ev);
    const result: RecType = await postToServer('prefs/save', this.getData());
    // console.log("result = ", result);
    if (result.ok) {
      this.close();
      Flash.success("Preferences saved.")
    } else {
      Flash.error(result.errors);
    }
    return false;
  }

  onChangePref(prop: string, ev: Event){
    const value = this.getValue(prop);
    switch(prop) {
      case 'clock':
        clock.setClockStyle(value); break;
      case 'counter':
        clock.setCounterMode(value); break;
      case 'theme':
        ui.setUITheme(value); break;
      default:
        // Nothing to do
    }
  }
  onOpen(ev: MouseEvent){
    this.open();    
    return stopEvent(ev);
  }
  onClose(ev: MouseEvent){
    this.close();
    return stopEvent(ev);
  }


  public setData(data: PrefsDataType){
    // console.log("Data prefs", data);
    this.data = data;
    this.fieldsReady || this.observeFields();
    Object.entries(this.data).forEach(([k , v]) => {
      this.setValue(k, v);
    });
  }
  private getData(){
    Object.entries(this.data).forEach(([k , _v]) => {
      Object.assign(this.data, {[k]: this.getValue(k)});
    });
    return this.data;
  }

  public getValue(prop: string) {
    switch(prop) {
      case 'random':
        return this.field('random').checked;
      default:
        return this.field(prop).value;
    }
  }
  private setValue(prop: string, value: string | boolean){
    switch(prop) {
      case 'random':
        this.field('random').checked = value; break;
      default:
        this.field(prop).value = value;
    }
  }

  private field(key: string){
    return DGet(`#prefs-${key}`) || console.error("Le champ 'prefs-%s' est introuvable", key);
  }

  private close(){ 
    ui.openSection('work');
    ui.closeSection('prefs');
  }
  private open(){ 
    ui.openSection('prefs');
    ui.closeSection('work');
  }

  private observeButtons(){
    listenBtn('prefs', this.onOpen.bind(this));
    listenBtn('close-prefs', this.onClose.bind(this));
    listenBtn('save-prefs', this.onSave.bind(this));
    listenBtn('open-datafile', this.onOpenDataFile.bind(this));
  }
  private observeFields(){
    Object.keys(this.data).forEach((prop: string) => {
      this.field(prop).addEventListener('change', this.onChangePref.bind(this, prop));
    });
    this.fieldsReady = true;
  }

}
export const prefs = Prefs.getInstance();