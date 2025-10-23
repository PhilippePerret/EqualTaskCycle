import yaml from 'js-yaml';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import type { RecType, WorkType } from './types';
import path from 'path';
import { prefs } from './prefs_server_side';


export class DataManager {
  private _data!: RecType;

  public setData(allData: WorkType[]){
    console.log("[DataManager] Je dois sauvegarder : ", allData);
    this.backupDataFile()
    writeFileSync(this.dataPath, yaml.dump(allData), {encoding: 'utf8'});
  }

  private backupDataFile(){
    const folder = path.dirname(this.dataPath);
    const backupFolder = path.join(folder, 'tmp', 'backups');
    mkdirSync(backupFolder, {recursive: true}); // au cas où
    const backupPath = path.join(backupFolder, `backup-data-${new Date().getTime()/1000}.yaml`);
    writeFileSync(backupPath, readFileSync(this.dataPath, 'utf8'), {encoding: 'utf8'});
  }

  // Relever les données du fichier ou des données par défaut
  public getData(){
    if (existsSync(this.dataPath as string)) {
      this._data = yaml.load(readFileSync(this.dataPath, 'utf8')) as RecType;
    } else {
      this._data = {
        duration: 120,
        works: [{
          id: 'init',
          project: "Init the app",
          content: "Build a _TASKS_.yaml file with data.",
          folder: path.resolve('.'),
        } as WorkType]
      }
    }
    return this._data;
  }

  public getDefaultDuration(): number {
    return this._data.duration || 120;
  }

  private get dataPath(){ return prefs.data.file as string}

}