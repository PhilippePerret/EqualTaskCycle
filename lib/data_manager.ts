import yaml from 'js-yaml';
import { existsSync, readFileSync } from 'fs';
import type { RecType, WorkType } from './types';
import path from 'path';


export class DataManager {
  private _data!: RecType;

  // TODO Vérifier que le fichier existe
  public getData(){
    if (existsSync('_TASKS_.yaml')) {
      this._data = yaml.load(readFileSync('_TASKS_.yaml', 'utf8')) as RecType;
    } else {
      this._data = {
        duration: 120,
        works: [{
          id: 'init',
          name: "Init the app",
          content: "Build a _TASKS_.yaml file with data.",
          folder: path.resolve('.')
        } as WorkType]
      }
    }
    return this._data;
  }

  public getDefaultDuration(): number {
    return this._data.duration || 120;
  }

}