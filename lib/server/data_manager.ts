import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import type { RecType, WorkType } from '../shared/types';
import { prefs } from './prefs';
import { t } from '../shared/Locale';


export class DataManager {
  private _data!: RecType;

  public setData(allData: WorkType[]){
    console.log("[DataManager] Je dois sauvegarder : ", allData);
    existsSync(this.dataPath) && this.backupDataFile()
    writeFileSync(this.dataPath, yaml.dump(allData), {encoding: 'utf8'});
  }

  private backupDataFile(){
    const folder = path.dirname(this.dataPath);
    const backupFolder = path.join(folder, 'tmp', 'backups');
    mkdirSync(backupFolder, {recursive: true}); // au cas où
    const backupPath = path.join(backupFolder, `backup-data-${new Date().getTime()/1000}.yaml`);
    writeFileSync(backupPath, readFileSync(this.dataPath, 'utf8'), {encoding: 'utf8'});
  }

  /**
   * Relever les données du fichier ou des données par défaut
   * 
   * Note : Au tout premier lancement de l'application, le fichier des
   * travaux n'existe pas.
   */
  public getData(): WorkType[] {
    if (existsSync(this.dataPath as string)) {
      return yaml.load(readFileSync(this.dataPath, 'utf8')) as WorkType[];
    } else {
      return this.defaultData;
    }
  }

  public get defaultData(){return [{
      id: 'start',
      active: true,
      project: "ETC",
      content: t('task.very_first_one'),
      folder: path.join(os.homedir(), 'Documents'),
    } as WorkType]
  }

  public getDefaultDuration(): number {return prefs.data.duree}
  private get dataPath(){ return prefs.data.file as string}

}