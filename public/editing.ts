import { WorkProps, type RecType, type WorkType } from "../lib/types";
import { DGet } from "./js/dom";
import { Flash } from "./js/flash";
import { prefs } from "./prefs";
import { ui } from "./ui";
import { postToServer } from "./utils";

interface AllDataType {
  duration: number;
  works: WorkType;
}

class Editing {

  private get section(){ return DGet('section#editing')}

  /**
   * Fonction retourne toutes les données pour les enregistrer
   * 
   */
  getAllData(): AllDataType{
    return {} as AllDataType
  }

  /**
   * Fonction qui met dans la fenêtre toutes les valeurs  
   * 
   */
  setAllValues(){
    this.editTasks();
    this.setConfigData();
  }

  /**
   * Grande fonction qui édite les tâches
   */
  async editTasks(){
    const container = this.taskContainer;
    console.log("container", container);
    const formClone = this.section.querySelector('.editing-task-form');
    console.log("formClone", formClone);
    container.innerHTML = '';
    const retour: RecType = await postToServer('tasks/all', {dataPath: prefs.getValue('file')});
    console.log("Retour de tasks/all", retour);
    if (retour.ok === false ) { return Flash.error(retour.error) }
    const works = retour.data.works;
    // Indiquer le nombre de tâches
    DGet('span#tasks-count', this.section).innerHTML = works.length;
    // Créer tous les formulaires pour les tâches
    works.forEach((work: WorkType) => {
      const owork:HTMLDivElement = formClone.cloneNode(true);
      container.appendChild(owork);
      this.peupleWorkForm(owork, work);
      owork.classList.remove('hidden');
    })
  }
  private peupleWorkForm(obj: HTMLDivElement, work: WorkType){
    WorkProps.forEach((prop: string) => {
      const field = DGet(`.form-task-${prop}`, obj);
      let value = (work as any)[prop];
      if (prop === 'active' && undefined === value) { value = true }
      field.value = value || '';
    })
  }

  private get taskContainer(){
    return DGet('div#editing-tasks-container');
  }

  setConfigData(){
    console.error("Je dois apprendre à renseigner les valeurs de configuration.")
  }



  onAddTask(){
    Flash.notice("Je dois apprendre à ajouter une tâche.")
  }

  onSaveData(){
    Flash.error("Je dois apprendre à sauver les données.")
    postToServer('/tasks/save', this.getAllData());
  }
  
  /**
   * Pour démarrer l'édition des tâches (en fait tout le fichier d'édition)
   */
  startEditing(){
    ui.toggleSection('editing');
    this.setAllValues();
  }

  // Pour finir l'édition et revenir au panneau principal
  stopEditing(){
    ui.toggleSection('work');
  }

  init(){
    this.observeButtons()
  }

  observeButtons(){
    this.listenBtn('start', this.startEditing.bind(this));
    this.listenBtn('end', this.stopEditing.bind(this));
    this.listenBtn('add', this.onAddTask.bind(this));
    this.listenBtn('save', this.onSaveData.bind(this));
  }
  listenBtn(id: string, method: Function) {
    DGet(`button.btn-editing-${id}`).addEventListener('click', method);
  }

  public static getIntance(){return this._inst || (this._inst = new Editing())}
  private static _inst: Editing;
  private constructor(){}
}

export const editor = Editing.getIntance();