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

interface ConfigDataType {
  duration: number;
  theme?: string;
}
const ConfigProperties: [string, any][] = [
  ['duration', 120], 
  ['theme', 'light']
];

class Editing {

  private get section(){ return DGet('section#editing')}
  private get configContainer(){
    return this._configcont || (this._configcont = DGet('#editing-config-container', this.section))
  }; private _configcont!: HTMLDivElement;

  /**
   * Fonction retourne toutes les données pour les enregistrer
   * 
   */
  getAllData(): AllDataType{
    const AllData = this.collectConfigData();
    Object.assign(AllData, {works: this.collectTaskData()})
    return AllData as AllDataType;
  }

  /**
   * Fonction qui relève et revoie les données de configuration générale
   */
  collectConfigData(): ConfigDataType {
    const configData: ConfigDataType = {
      duration: Number(this.getConfProp('duration')),
      theme: this.getConfProp('theme')
    }
    return configData;
  }
  private getConfProp(prop: string): string {
    return DGet(`#config-data-${prop}`, this.configContainer).value;
  }

  private setConfigData(data: RecType){
    ConfigProperties.forEach((paire: [string, any]) => {
      const [prop, defaultValue] = paire;
      this.setConfProp(prop, data[prop] || defaultValue);
    })
  }
  private setConfProp(prop: string, value: any): void {
    DGet(`#config-data-${prop}`, this.configContainer).value = value;
  }

  /**
   * Fonction qui relève (et renvoie) les données des tâches dans 
   * la liste.
   */
  collectTaskData(){
    const newTaskData: WorkType[] = [];
    this.taskContainer.querySelectorAll('.editing-task-form').forEach((form: HTMLDivElement) => {
      newTaskData.push(this.getTaskDataIn(form));
    })
    console.log("newTaskData = ", newTaskData);
  }

  getTaskDataIn(form: HTMLDivElement): WorkType {
    const taskData: RecType = {};
    WorkProps.forEach((prop: string) => {
      let value: string | boolean | number = DGet(`.task-form-${prop}`, form).value;
      if (prop === 'active') { value = (0, eval)(value as string); }
      Object.assign(taskData, {[prop]: value});
    })
    return taskData as WorkType;
  }

  /**
   * Grande fonction qui remonte les données du fichier de donnée
   * et prépare les formulaires des données de configuration et de 
   * tâches
   */
  async startEditing(){
    ui.toggleSection('editing');
    const container = this.taskContainer;
    console.log("container", container);
    const formClone = this.section.querySelector('.editing-task-form');
    console.log("formClone", formClone);
    container.innerHTML = '';
    const retour: RecType = await postToServer('tasks/all', {dataPath: prefs.getValue('file')});
    console.log("Retour de tasks/all", retour);
    if (retour.ok === false ) { return Flash.error(retour.error) }
    // --- Données de configuration (générales) ---
    this.setConfigData(retour.data);
    // --- TACHES/WORKS ---
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

  onAddTask(){
    Flash.notice("Je dois apprendre à ajouter une tâche.")
  }

  onSaveData(){
    Flash.error("Je dois apprendre à sauver les données.")
    console.log("On doit sauver les données : ", this.getAllData());
    // postToServer('/tasks/save', this.getAllData());
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