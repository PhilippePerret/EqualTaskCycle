/**
 * Module qui s'assure que l'utilisateur est bien en train de 
 * travailler sur le projet courant de la tâche.
 * Pour ce faire, il cherche le premier fichier/dossier modifié
 * depuis la précédente date de check.
 */
import fs from 'fs';
import path from 'path';
import { Dialog } from './Dialog';
import { t } from '../shared/Locale';

const fileWatcher = new Worker('./lib/ActivityTracker_watcher.ts');

export class ActivityTracker /* SERVER */ {
  public static getInstance(){
    return this._inst || (this._inst = new ActivityTracker());
  }; private static _inst: ActivityTracker;
  private constructor(){}


  // Partie Watcher
  private get watcher(){
    return this._watcher || (this._watcher = fileWatcher)
  }; 
  private _watcher?: Worker;

  /**
   * @api
   * 
   * Lancement du watcher qui essaie de trouver un fichier modifié 
   * dans le projet dans le quart d'heure précédent
   */
  public watchActivity(folder: string, lastCheckAt: number): Promise<boolean> {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        this.watcher.removeEventListener('message', handler);
        resolve(event.data.active);
      };
      this.watcher.addEventListener('message', handler);
      this.watcher.postMessage({ folder, lastCheckAt });
    });
  }

  private on?: boolean; // true if user work

  public async askUserIfWorking(){
    await this.askIfActifDialog.show();
    return {ok: true, userIsWorking: this.on === true}
  }

  private get askIfActifDialog(){
    return this._dialog || (this._dialog = this.getDialog())
  }; private _dialog?: Dialog;

  private onChooseActivityState(state: boolean, ev: Event) { this.on = state }

  private getDialog(){
    return new Dialog({
      title: t('ui.title.confirmation_required'),
      message: t('ui.text.are_you_still_working'),
      buttons: [
        {text: t('ui.button.not_anymore'), onclick: this.onChooseActivityState.bind(this, false)},
        {text: t('ui.button.yes_still'), onclick: this.onChooseActivityState.bind(this, true)}
      ],
      timeout: 120,
      onTimeout: this.onChooseActivityState.bind(this, false),
      icon: process.env.APP_ICON_PATH
    })
  }
}

export const activTracker = ActivityTracker.getInstance();

/**
 * @api
 * 
 * Vérifie que l'utilisateur est encore en train de travailler sur
 * son projet et renvoie True le cas échéant. False otherwise.
 * 
 * @param folder Path du dossier du projet
 * @param lastCheckAt Date de dernier check (par défaut : il y a 15 minutes)
 */
export function isUserWorkingOnProject(folder: string, lastCheckAt: number): boolean {
  
  const checkedPaths = new Set();

  /**
   * Vérifie si le fichier/dossier +hpath+ a été modifié depuis la
   * dernière date de vérification.
   * 
   * @param hpath Full real path of the file to check
   * @param date Of the last check
   */
  function hasBeenModifiedSince(stats: fs.Stats, lastCheck: number): boolean {
    return stats.mtimeMs > lastCheck ;
  }

  /**
   * Résoud les liens symboliques (if any)
   */
  function hardPathOf(folder:string, dirent: fs.Dirent): string | undefined {
    const fullPath = path.join(folder, String(dirent.name));
    if (dirent.isSymbolicLink()) {
      try {
        const target: string = fs.readlinkSync(fullPath);
        return path.resolve(folder, target);      
      } catch(error) {
        console.error('Unable to read link of ' + fullPath);
        return ;
      }
    } else {
      return fullPath; 
    }
  }

  /**
   * Fouille le dossier +folder+ pour trouver un premier élément 
   * modifié depuis la dernière date de check.
   * 
   * @param folder Path du dossier
   * @returns null | string (chemin d'accès au fichier modifié)
   */
  function traverseFolder(folder: string): null | string {
    if ( checkedPaths.has(folder) ) { return null } 
    else { checkedPaths.add(folder) }
    let entries: fs.Dirent[];
    let found: null | string;
    let stats: fs.Stats;
    try {
      entries = fs.readdirSync(folder, { withFileTypes: true });
    } catch(error) {
      console.error(`Unable to read '${folder}' directory…`)
      return null;
    }
    // Loop on all entries
    for (const entry of entries) {
      const hardPath: string | undefined = hardPathOf(folder, entry);
      if (undefined === hardPath) continue; // erreur
      if ( checkedPaths.has(hardPath) ) { continue } else { checkedPaths.add(hardPath) }
      try {
        stats = fs.statSync(hardPath);
      } catch(error) {
        console.error('Unable to read stat of ' + hardPath);
        continue;
      }
      if (hasBeenModifiedSince(stats, lastCheckAt)) { 
        return hardPath; 
      } else if (stats.isDirectory()) {
        if ( (found = traverseFolder(hardPath)) ) { return found; }
      }
    }
    return null;
  }
  return !!traverseFolder(folder) ;
}


/* (ajouter un "/" devant pour effectuer le TEST)
// TEST
// ----
// Toucher (touch) ce fichier pour que le test passe

const folderPath = path.resolve('.');
console.log("Dossier: %s", folderPath);
const ilya15mns = new Date().getTime() - 15 * 60 * 1000;
console.log("Dernier check = %i", ilya15mns, new Date(ilya15mns));
if ( isUserWorkingOnProject(folderPath, ilya15mns) ) {
  console.log("OK");
} else {
  console.error("Le test aurait dû retourner true")
}

//*/