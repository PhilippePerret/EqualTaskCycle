import { HOST } from "./js/constants";
import { DGet, stopEvent } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";

export class Prefs {
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
      body: JSON.stringify({ 
        works_file_path: DGet('input#works-file-path').value 
      })
    }).then(r => r.json());
    console.log("result = ", result);
    if (result.ok) {
      this.close();
      Flash.notice("Preferences saved.")
    } else {
      Flash.error(result.error);
    }
    return false;
  }

  onOpen(ev: MouseEvent){
    ui.closeSectionWork()
    this.open();
    this.section.classList.remove('hidden')
    
    return stopEvent(ev);
  }
  onClose(ev: MouseEvent){
    this.close();
    ui.openSectionWord();
    return stopEvent(ev);
  }

  private close(){ this.section.classList.add('hidden') }
  private open(){ this.section.classList.remove('hidden')}

  private get section(){
    return DGet('section#preferences');
  }

}
export const prefs = Prefs.getInstance();