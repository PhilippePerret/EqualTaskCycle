import { clock } from "../lib/Clock";
import type { PrefsDataType } from "../lib/types";
import { HOST } from "./js/constants";
import { DGet, stopEvent } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";


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
   * Fonction appelée pour sauver les données de préférence
   */
  async onSave(ev: MouseEvent){
    stopEvent(ev);
    const result = await fetch(HOST + 'prefs/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.getData())
    }).then(r => r.json());
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

  private getValue(prop: string) {
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
    DGet('button.btn-prefs').addEventListener('click', this.onOpen.bind(this));
    DGet('button.btn-close-prefs').addEventListener('click', this.onClose.bind(this));
    DGet('button.btn-save-prefs').addEventListener('click', this.onSave.bind(this));
  }
  private observeFields(){
    Object.keys(this.data).forEach((prop: string) => {
      this.field(prop).addEventListener('change', this.onChangePref.bind(this, prop));
    });
    this.fieldsReady = true;
  }

}
export const prefs = Prefs.getInstance();