import path from "path";
import os from 'os';
import type { PrefsDataType, RecType } from "./types";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { userDataPath } from "./constants_server";
import { t, tf } from '../lib/Locale';


type ReportType = {
  ok: boolean,
  errors: string[] | string;
}


class Prefs { /* singleton */

  private DEFAULT_DATA:PrefsDataType = {
    lang:   'en',
    duree:  120,
    file:   path.join(os.homedir(), 'Documents', 'ETC_Tasks.yaml'),
    clock:  'big',
    theme:  'dark',
    random: true,
    counter: 'clock', // Temps sous forme de compte à rebours
    shortest: false // => les plus longues d'abord
  }

  private static inst: Prefs;
  private constructor(){}
  public static getInstance(){
    return this.inst || (this.inst = new Prefs());
  }

  public get data(): PrefsDataType {
    return this._data || (this._data = this.load())
  }; private _data!: PrefsDataType;

  load(){
    const data: PrefsDataType = Object.assign({}, this.DEFAULT_DATA);
    if (existsSync(this.fpath)) {
      return Object.assign(data, JSON.parse(readFileSync(this.fpath,'utf8')));
    } else {
      return data;
    }
  }

  save(data: RecType){
    // Sauvegarde du fichier de données des tâches
    const report: ReportType = {ok: true, errors: []};
    // Todo Faire ici les autres checks nécessaires

    writeFileSync(this.fpath, JSON.stringify(data));

    // Rapport de retour
    const errorCount = report.errors.length;
    report.errors = (report.errors as any).join(', ');
    report.ok = errorCount === 0;

    return report;
  }

  private get fpath(){
    return path.join(userDataPath as string, 'prefs.json');
  }
}

export const prefs = Prefs.getInstance();