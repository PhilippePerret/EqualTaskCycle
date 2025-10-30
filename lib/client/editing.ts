import { WORK_PROPS, type RecType, type WorkType } from "../shared/types";
import { DGet } from "../../public/js/dom";
import { Flash } from "../../public/js/flash";
import { ui } from "./ui";
import { listenBtn, postToServer } from "../shared/utils";
import { t } from '../shared/Locale';
import { Work } from "./work";
import log from 'electron-log/renderer';

class Editing {

  // Table des travaux au départ de l'édition (pour comparaison
  // avec les modifications effectuées)
  private originalWorks!: {[x: string]: WorkType};
  // Table des données modifiée (ou pas)
  private modifiedWorks!: {[x: string]: WorkType};
  // Table pour mettre les modifications
  private changesetWorks!: {[x: string]: RecType};

  private get section(){ return DGet('section#editing')}
  private get configContainer(){
    return this._configcont || (this._configcont = DGet('#editing-config-container', this.section))
  }; private _configcont!: HTMLDivElement;

  /**
   * Fonction qui relève (et renvoie) les données des tâches dans 
   * la liste. Elle vérifie les changements et les valeurs sensibles
   * (identifiants changés ou nouveau, chemins d'accès aux dossiers,
   * au script etc.)
   */
  private async collectTaskData(): Promise<WorkType[]> {
    console.info("originalWorks", this.originalWorks);
    this.modifiedWorks = {};
    this.taskContainer.querySelectorAll('.editing-form-work').forEach( (form: HTMLDivElement) => {
      const wdata = this.getTaskDataIn(form);
      if (wdata.id === '') { wdata.id = this.getIdFromProject(wdata.project) }
      Object.assign(this.modifiedWorks, {[wdata.id]: wdata});
    });
    console.info("modifiedWorks", this.modifiedWorks);
    // Relève des changements
    this.changesetWorks = {}
    Object.entries(this.modifiedWorks).forEach(([idw, work]:[string, WorkType]) => {
      const originalWork = (this.originalWorks[idw] as any) || {}; // creating
      const modifiedWork = work as any;
      // console.log("originalWork = ", originalWork);
      // console.log("modifiedWork = ", modifiedWork);
      Object.assign(this.changesetWorks, {[idw]: {id: idw, count: 0, change: [], errors: {}}});
      for(var prop of WORK_PROPS){
        const changeset = this.changesetWorks[idw] as any;
        // console.log("Compare '%s' avec '%s' (%s) et '%s' (%s) sont %s", prop, modifiedWork[prop], typeof modifiedWork[prop], originalWork[prop], typeof originalWork[prop], modifiedWork[prop] !== originalWork[prop] ? 'différent' : 'égaux');
        if (modifiedWork[prop] !== originalWork[prop]) {
          (this.changesetWorks[idw] as any).count ++;
          (this.changesetWorks[idw] as any).change.push(prop);
        }
      }
    });
    console.info("changesetWorks avant", this.changesetWorks);
    // Étude des problèmes éventuels
    let errorCount = 0;
    for(const [idw, changeset] of Object.entries(this.changesetWorks)){
      errorCount = await this.checkChangeset(changeset as any, errorCount);
    }

    console.info("Fin du check des modifications (%s erreurs)", errorCount);

    // Avant d'afficher les erreurs, on nettoie les champs
    WORK_PROPS.forEach((prop: string) => {
      this.taskContainer.querySelectorAll('div.err').forEach((o: HTMLDivElement) => o.innerHTML = '');
      this.taskContainer.querySelectorAll('.error').forEach((o: HTMLElement) => o.classList.remove('error'));
    });

    if (errorCount > 0) { 
      // On error
      Flash.error(t('error.data.error_found', [String(errorCount)]), {keep: false});
      // Display error in listing
      for(let [idw, changeset] of Object.entries(this.changesetWorks)){
        if (changeset.count === 0) { continue }
        const form = DGet(`div#work-${idw}`);
        for(const [prop, errMsg] of Object.entries(changeset.errors)){
          const oprop = DGet(`.form-work-${prop}`, form);
          const oErr = DGet(`.form-work-${prop}-err`, form);
          oprop.classList.add('error');
          oErr.innerHTML = errMsg;
        }
      }

      console.info("DES ERREURS SONT SURVENUES")
      return [] /* pour ne pas enregistrer */
    } else {
      // No error
      // On ne prend que les travaux modifiés
      return Object.values(this.changesetWorks)
        .filter((ch: RecType) => ch.count > 0)
        .map((ch: RecType) => this.modifiedWorks[ch.id]) as WorkType[];
    }
  }

  private async checkChangeset(changeset: any, errorCount: number): Promise<number> {
    const idw: string = changeset.id;
    // log.info('Check des changements du travail ', idw);
    console.info('Check des changements du travail ', idw);
    if (changeset.count === 0) { return errorCount } 
    for (const prop of changeset.change) {
      const newValue = (this.modifiedWorks as any)[idw][prop];
      switch(prop){
      case 'project':
        if (newValue === '') {
          Object.assign(changeset.errors, {'project': t('error.data.undefined_project')})
          ++ errorCount;
        }
        break;
      case 'id':
        if (await this.IDAlreadyExists(newValue)){
          Object.assign(changeset.errors, {'id': t('error.data.id_exists', [newValue])});
          ++ errorCount;
        }
        break;
      case 'folder':
        if (newValue === '') {
          Object.assign(changeset.errors, {'folder': t('error.data.folder_required')})
          ++errorCount;
        } else if (await this.unabledToFindProjectFolder(newValue)) {
          Object.assign(changeset.errors, {'folder': t('error.data.folder_unfound', [newValue])});
          ++ errorCount;
        }
        break;
      case 'script':
        if (newValue !== '') {
          if (await this.unabledToFindScript(newValue)){
            Object.assign(changeset.errors, {'script': t('error.data.script_unfound', [newValue])});
            ++ errorCount;
          } else if (await this.isNotExecutable(newValue)){
            Object.assign(changeset.errors, {'script': t('error.data.script_not_executable', [newValue])});
            ++ errorCount;
          }
        }
        break;
      }
    }
    console.info("errorCount fin checkChangeset: %i", errorCount);
    return errorCount;
  }

  private async IDAlreadyExists(id: string): Promise<boolean> {
    const retour = await postToServer('/check/id-existence', {id: id, process: 'Edition.IDAlreadyExists'})
    return retour.ok && retour.idExists;
  }

  private async unabledToFindProjectFolder(folder: string): Promise<boolean> {
    const retour = await postToServer('/check/folder-existence', {process: 'Editing.unfoundProjectFolder', folder: folder}) as any;
    console.log("Retour check folder", retour);
    return retour.ok && retour.folderExists === false;
  }

  private async unabledToFindScript(script: string): Promise<boolean> {
    const retour = await postToServer('/check/file-existence', {process: 'Editing.unabledToFindScript', file: script}) as any;
    return retour.ok && retour.fileExists === false;
  }

  private async isNotExecutable(script: string): Promise<boolean> {
    const retour = await postToServer('/check/file-executable', {process: 'Editing.isNotExecutable', file: script}) as any;
    return retour.ok && retour.isExecutable === false;
  }

  getTaskDataIn(form: HTMLDivElement): WorkType {
    const taskData: RecType = {};
    WORK_PROPS.forEach((prop: string) => {
      const field = DGet(`.form-work-${prop}`, form)
      let value: string | number | undefined | null = field.value.trim();
      const dataFieldType = field.dataset.type;
      if (value === 'null' || value === null) {
        value = null;
      } else {
        switch(dataFieldType){
          case 'string': value = String(value); break;
          case 'number': value = Number(value); break;
          case 'number-or-nil': value = value === '' ? null : Number(value); break;
        }
      }
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
    container.innerHTML = '';
    const retour: RecType = await postToServer('/tasks/all', {process: 'Editing.startEditing'});
    if (retour.ok === false ) { return }
    // --- TACHES/WORKS ---
    const works = retour.works;
    log.info("Works retreaved", works);
    // On consigne les travaux actuels pour voir ceux qui auront 
    // changé ou été créé. On conserve les informations dans une
    // table.
    this.originalWorks = {};
    works.forEach((w: WorkType) => Object.assign(this.originalWorks, {[w.id]: w}))
    // Indication du nombre de travaux dans le titre
    DGet('span#tasks-count', this.section).innerHTML = works.length;
    // Créer tous les formulaires pour les tâches
    works.forEach((work: WorkType) => { this.createNewTask(work) })
  }

  private get formClone(){
    return this._formtemp || (this._formtemp = this.section.querySelector('.editing-form-work'))
  }

  private createNewTask(work: WorkType): HTMLDivElement {
    const owork:HTMLDivElement = this.formClone.cloneNode(true) as HTMLDivElement;
    owork.id = `work-${work.id}`;
    this.taskContainer.appendChild(owork);
    this.peupleWorkForm(owork, work);
    this.observeWorkForm(owork, work);
    owork.classList.remove('hidden');
    if (work.active) owork.classList.remove('off');
    return owork;
  }


  private peupleWorkForm(obj: HTMLDivElement, work: WorkType){
    WORK_PROPS.forEach((prop: string) => {
      // console.log("prop: '%s'", prop);
      const field = DGet(`.form-work-${prop}`, obj);
      let value = (work as any)[prop];
      if ( value === 'null') {
        (work as any)[prop] = null; 
        value = null;
      }
      field.value = typeof value === 'undefined' ? '' : value;
    });
    DGet('span.task-id-disp', obj).innerHTML = work.id;
  }
  private observeWorkForm(owork: HTMLDivElement, work: WorkType){
    listenBtn('up', this.onUp.bind(this, owork), owork);
    listenBtn('down', this.onDown.bind(this, owork), owork);
    listenBtn('remove', this.onRemove.bind(this, work), owork);
    const menuActive = DGet('.form-work-active', owork)
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
      id: '',
      project: t('ui.text.your_project'),
      content: t('ui.text.temp_description'),
      folder: t('ui.text.path_example'),
      active: 0
    } as WorkType);
    owork.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (owork.querySelector('input.form-work-project') as HTMLInputElement)
    .addEventListener('change', this.findIdIfRequied.bind(this, owork));
  }

  private findIdIfRequied(owork: HTMLDivElement, ev: Event){
    const projectField = (owork.querySelector('input.form-work-project') as HTMLInputElement);
    const idField = (owork.querySelector('input.form-work-id') as HTMLInputElement);
    const dispField = owork.querySelector('.task-id-disp') as HTMLSpanElement;

    let idProjet: string;
    if (idField.value === '') {
      const project = projectField.value.trim();
      if (project === '') {
        idProjet = this.getDefaultId();
      } else {
        idProjet = this.getIdFromProject(project);
      }
      idField.value = idProjet;
      dispField.innerHTML = idProjet;
    }
  }
  private getDefaultId(){
    const now = String(new Date().getTime());
    const len = now.length;
    return `prj${this.suffixFromDate(8)}`;
  }
  private getIdFromProject(project: string) {
    if (project === '') { project = 'UnnamedProject'}
    const idp = project.toLowerCase()
      .replace(/[^a-zA-Z-0-9 ]/g, '')
      .split(' ')
      .map(seg => seg.length > 3 ? seg.substring(0, 3) : seg)
      .join('');
    return idp + this.suffixFromDate(4);
  }
  private suffixFromDate(long: number){
    const now = String(new Date().getTime());
    const len = now.length;
    return now.substring(len - long, len)
  }

  /**
   * Pour enregistrer les nouvelles données sur les tâches.
   * 
   * Note : la tâche courante a peut-être été modifiée, il faut 
   * l'actualiser.
   */
  private async onSaveData(){
    const collectedData: WorkType[] = await this.collectTaskData();
    if (collectedData.length === 0 /* erreur détectée ou no changement */) { 
      console.log("--- PAS D'ENREGISTREMENT ---")
      return 
    }

    console.info("Travaux à enregistrer : ", collectedData);
    console.info("On ne fait rien pour le moment")
    return // on ne fait rien pour le moment

    const retour = await postToServer('/tasks/save', {process: 'Editing.onSaveData', works: collectedData});
    if (retour.ok){ 
      Flash.success(t('task.saved'));
      // On actualise la tâche affichée (courante)
      const curWId = Work.currentWork.id;
      const curWData = collectedData.find(w => w.id === curWId);
      const curWork = Work.currentWork;
      curWork.updateData(curWData as WorkType);
      curWork.dispatchData();
    }
  }

  // Pour finir l'édition et revenir au panneau principal
  stopEditing(){
    ui.toggleSection('work');
  }

  init(){
    this.observeButtons()
    return true;
  }

  private observeButtons(){
    listenBtn('editing-start', this.startEditing.bind(this));
    listenBtn('editing-end', this.stopEditing.bind(this));
    listenBtn('editing-add', this.onAddTask.bind(this));
    listenBtn('editing-save', this.onSaveData.bind(this));
  }


  public static singleton(){return this._inst || (this._inst = new Editing())}
  private static _inst: Editing;
  private constructor(){}
  private _formtemp!: HTMLDivElement;

}

export const editor = Editing.singleton();