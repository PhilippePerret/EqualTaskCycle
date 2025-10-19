/**
 * Ce que j'appelle le "runtime" ici, c'est ce qui concerne les temps 
 * de travail, notamment de chaque tâche, conservés dans le fichier
 * .runtimes
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { RecType, RunTimeInfosType } from './types';

export class RunTime {
  private _data!: RecType;

  /**
   * Retourne les informations sur le travail de la tâche,
   * à commencer par la durée de travail qui lui a déjà été
   * consacré.
   * 
   * @param workId Identifiant de la tâche
   * @returns Les infos sur le travail de la tâche
   */
  public getInfosOn(workId: string): RunTimeInfosType {
    return this._data[workId] || {
      workedTime: 0,
      lastTime: undefined
    } as RunTimeInfosType;
  }

  public init(){
    this.getData();
  }

  private getData(){
    if (existsSync(this.dataFile)) {
      this._data = JSON.parse(readFileSync(this.dataFile, 'utf8'));
    } else {
      this._data = {};
    }
  }
  private setData(){
    writeFileSync(this.dataFile, JSON.stringify(this._data));
  }
  private get dataFile(){
    return path.join('.', '.runtimes');
  }
}