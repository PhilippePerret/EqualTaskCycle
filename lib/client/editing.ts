import { WorkProps, type RecType, type WorkType } from "../shared/types";
import { DGet } from "../../public/js/dom";
import { Flash } from "../../public/js/flash";
import { prefs } from "./prefs";
import { ui } from "./ui";
import { listenBtn, postToServer } from "../shared/utils";
import { nanoid } from 'nanoid';
import { t } from '../shared/Locale';


class Editing {

  private get section(){ return DGet('section#editing')}
  private get configContainer(){
    return this._configcont || (this._configcont = DGet('#editing-config-container', this.section))
  }; private _configcont!: HTMLDivElement;

  /**
   * Fonction qui relève (et renvoie) les données des tâches dans 
   * la liste.
   */
  collectTaskData(): WorkType[] {
    const newTaskData: WorkType[] = [];
    this.taskContainer.querySelectorAll('.editing-form-task').forEach((form: HTMLDivElement) => {
      newTaskData.push(this.getTaskDataIn(form));
    })
    return newTaskData;
  }

  getTaskDataIn(form: HTMLDivElement): WorkType {
    const taskData: RecType = {};
    WorkProps.forEach((prop: string) => {
      let value: string | boolean | number = DGet(`.form-task-${prop}`, form).value;
      if (value !== '') {
        if (prop === 'active') { value = (0, eval)(value as string) }
        else if (prop === 'duration') { value = Number(value) }
        // On consigne la valeur
        Object.assign(taskData, {[prop]: value});
      }
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
    container.innerHTML = '';
    const retour: RecType = await postToServer('/tasks/all', {dataPath: prefs.getValue('file')});
    if (retour.ok === false ) { return Flash.error(retour.error) }
    // --- TACHES/WORKS ---
    const works = retour.works;
    // Indiquer le nombre de tâches
    DGet('span#tasks-count', this.section).innerHTML = works.length;
    // Créer tous les formulaires pour les tâches
    works.forEach((work: WorkType) => { this.createNewTask(work) })
  }

  private get formClone(){
    return this._formtemp || (this._formtemp = this.section.querySelector('.editing-form-task'))
  }

  private createNewTask(work: WorkType): HTMLDivElement {
    const owork:HTMLDivElement = this.formClone.cloneNode(true) as HTMLDivElement;
    this.taskContainer.appendChild(owork);
    this.peupleWorkForm(owork, work);
    this.observeWorkForm(owork, work);
    owork.classList.remove('hidden');
    if (work.active) owork.classList.remove('off');
    return owork;
  }


  private peupleWorkForm(obj: HTMLDivElement, work: WorkType){
    WorkProps.forEach((prop: string) => {
      const field = DGet(`.form-task-${prop}`, obj);
      let value = (work as any)[prop];
      if (prop === 'active') {
        if (undefined === value) { value = true }
        value = String(value);
      }
      field.value = String(value || '');
    });
    DGet('span.task-id-disp', obj).innerHTML = work.id;
  }
  private observeWorkForm(owork: HTMLDivElement, work: WorkType){
    listenBtn('up', this.onUp.bind(this, owork), owork);
    listenBtn('down', this.onDown.bind(this, owork), owork);
    listenBtn('remove', this.onRemove.bind(this, work), owork);
    const menuActive = DGet('.form-task-active', owork)
    menuActive.addEventListener('change', (ev: Event) => {
      const actif = menuActive.value === 'true';
      owork.classList[actif?'remove':'add']('off'); 
    });
  }


  private onUp(owork: HTMLDivElement, ev: MouseEvent){
    if (owork.previousSibling) {
      (owork.parentNode as HTMLDivElement).insertBefore(owork, owork.previousSibling);
    }
  }
  private onDown(owork: HTMLDivElement, ev: MouseEvent){
    if (owork.nextSibling) {
      if (owork.nextSibling.nextSibling) {
        (owork.parentNode as HTMLDivElement).insertBefore(
          owork, owork.nextSibling.nextSibling
        ) 
      } else {
        (owork.parentNode as HTMLDivElement).appendChild(owork);
      }
    }
  }
  private onRemove(work: WorkType, ev: MouseEvent){
    Flash.notice(t('task.destroy', [work.id]));
  }

  private get taskContainer(){
    return DGet('div#editing-tasks-container');
  }

  onAddTask(){
    const owork = this.createNewTask({
      id: nanoid().toLowerCase(),
      project: t('ui.text.your_project'),
      content: t('ui.text.temp_description'),
      folder: t('ui.text.path_example'),
      active: false
    } as WorkType);
    owork.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private async onSaveData(){
    const retour = await postToServer('/tasks/save', this.collectTaskData());
    if (retour.ok){
      Flash.success(t('task.saved'));
    }
  }

  // Pour finir l'édition et revenir au panneau principal
  stopEditing(){
    ui.toggleSection('work');
  }

  init(){
    this.observeButtons()
  }

  private observeButtons(){
    listenBtn('editing-start', this.startEditing.bind(this));
    listenBtn('editing-end', this.stopEditing.bind(this));
    listenBtn('editing-add', this.onAddTask.bind(this));
    listenBtn('editing-save', this.onSaveData.bind(this));
  }


  public static getIntance(){return this._inst || (this._inst = new Editing())}
  private static _inst: Editing;
  private constructor(){}
  private _formtemp!: HTMLDivElement;

}

export const editor = Editing.getIntance();