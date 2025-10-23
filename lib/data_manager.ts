import yaml from 'js-yaml';
import { existsSync, readFileSync } from 'fs';
import type { RecType, WorkType } from './types';
import path from 'path';


export class DataManager {
  private _data!: RecType;

  // Relever les données du fichier ou des données par défaut
  // ATTENTION !!! ICI C'EST FAUX, ON DÉTERMINE MAINTENANT 
  // SOI-MÊME LE NOM DU FICHIER
  public getData(){
    console.error("IL FAUT CORRIGER ICI LE NOM FIXÉ")
    if (existsSync('_TASKS_.yaml')) {
      this._data = yaml.load(readFileSync('_TASKS_.yaml', 'utf8')) as RecType;
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

}