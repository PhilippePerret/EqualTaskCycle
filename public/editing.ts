import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { ui } from "./ui";


class Editing {

  init(){
    this.observeButtons()
  }

  onAddTask(){
    Flash.notice("Je dois apprendre à ajouter une tâche.")
  }
  
  /**
   * Pour démarrer l'édition des tâches (ou de tout le fichier d'édition)
   */
  startEditing(){
    ui.toggleSection('editing');
  }

  // Pour finir l'édition et revenir au panneau principal
  stopEditing(){
    ui.toggleSection('work');
  }

  observeButtons(){
    this.listenBtn('start', this.startEditing.bind(this));
    this.listenBtn('end', this.stopEditing.bind(this));
    this.listenBtn('add', this.onAddTask.bind(this));
  }
  listenBtn(id: string, method: Function) {
    DGet(`button.btn-editing-${id}`).addEventListener('click', method);
  }

  public static getIntance(){return this._inst || (this._inst = new Editing())}
  private static _inst: Editing;
  private constructor(){}
}

export const editor = Editing.getIntance();