import path from "path";
import type { RecType } from "./types";
import { existsSync, writeFileSync } from "fs";

const userDataPath = process.env.USER_DATA_PATH


type ReportType = {
  ok: boolean,
  errors: string[] | string;
}

class Prefs {
  private static instance: Prefs;
  private constructor(){}
  public static getInstance(){
    return this.instance || (this.instance = new Prefs());
  }

  save(data: RecType){
    // Sauvegarde du fichier de données des tâches
    const works_file_path = data.works_file_path;
    const report: ReportType = {ok: true, errors: []};
    const data2save: RecType = {};
    this.checkWorksFileValidity(works_file_path, report, data2save);
    // Todo Faire ici les autres checks nécessaires

    // S'il y a des données à sauver
    if (Object.keys(data2save).length) {
      console.log("path preférences : ", this.fpath);
      writeFileSync(this.fpath, JSON.stringify(data2save));
    } else {
      console.log("Aucune préférence à enregistrer");
    }

    // Rapport de retour
    const errorCount = report.errors.length;
    report.errors = (report.errors as any).join(', ');
    report.ok = errorCount === 0;

    return report;
  }

  private checkWorksFileValidity(pth: string, report: ReportType, data2save: RecType){
    if (!existsSync(pth)) {
      (report.errors as string[]).push("Unfound works file at " + pth);
    } else {
      // Todo vérifier s'il est bien formé

      Object.assign(data2save, {works_file_path: pth});
    }

  }

  private get fpath(){
    return path.join(userDataPath as string, 'prefs.json');
  }
}

export const prefs = Prefs.getInstance();