import yaml from 'js-yaml';
import { existsSync, readFileSync } from 'fs';
import type { RecType } from './types';


export class DataManager {
  private _data!: RecType;

  // TODO Vérifier que le fichier existe
  public getData(){
    if (existsSync('_TASKS_.yaml')) {
      this._data = yaml.load(readFileSync('_TASKS_.yaml', 'utf8')) as RecType;
    } else {
      this._data = {}
    }
    return this._data;
  }

  public getDefaultDuration(): number {
    return this._data.duration || 120;
  }

}