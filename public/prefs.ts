import type { PrefsDataType } from "../lib/types";
import { HOST } from "./js/constants";
import { DGet, stopEvent } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";

export class Prefs {
  private data!: PrefsDataType;



  private static instance: Prefs;
  private constructor(){}
  public static getInstance(){
    return this.instance || (this.instance = new Prefs())
  }

  public init(){
    DGet('button.btn-prefs').addEventListener('click', this.onOpen.bind(this));
    DGet('button.btn-close-prefs').addEventListener('click', this.onClose.bind(this));
    DGet('button.btn-save-prefs').addEventListener('click', this.onSave.bind(this));
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

  onOpen(ev: MouseEvent){
    this.open();    
    return stopEvent(ev);
  }
  onClose(ev: MouseEvent){
    this.close();
    return stopEvent(ev);
  }


  public setData(data: PrefsDataType){
    console.log("Data prefs", data);
    this.data = data;
    Object.entries(this.data).forEach(([k , v]) => {
      switch(k) {
        case 'random':
          this.field(k).checked = v;
          break;
        default:
          this.field(k).value = v;
      }
    });
  }
  private getData(){
    Object.entries(this.data).forEach(([k , v]) => {
      switch(k) {
        case 'random':
          Object.assign(this.data, {[k]: this.field(k).checked});
          break;
        default:
          Object.assign(this.data, {[k]: this.field(k).value});
      }
    });
    return this.data;
  }

  private field(key: string){
    return DGet(`#prefs-${key}`, this.section) || console.error("Le champ 'prefs-%s' est introuvable", key);
  }

  private close(){ 
    ui.openSectionWork();
    this.section.classList.add('hidden');
  }
  private open(){ 
    this.section.classList.remove('hidden');
    ui.closeSectionWork();
  }

  private get section(){
    return DGet('section#preferences');
  }

}
export const prefs = Prefs.getInstance();