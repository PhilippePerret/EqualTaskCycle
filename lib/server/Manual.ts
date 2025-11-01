import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { t } from '../shared/Locale';
import type { ResultType } from '../shared/types';

class Manual { /* singleton */
  private static inst: Manual;
  private constructor(){}
  public static singleton(){return this.inst || (this.inst = new Manual())}

  /**
   * Construction du manuel
   */
  public produce(lang: string): ResultType {
    try {
      const mpath = this.getPath(lang);
      // TODO le construire
      let sections: string[] | string = [];
      sections.push(`# ${t('help.manual.title')}`);
  
      const ordre = t('help.manual.ordre').split(" ").map(s => s.trim());
      console.log("Ordre = ", ordre, typeof ordre);
  
      ordre.forEach((khelp: string) => {
        (sections as any).push(`${t(`help.${khelp}.level`)} ${t('help.'+khelp+'.title')}`);
        let texte: string = t(`help.${khelp}.text`);
        texte = texte.replace(/^(\#+) /g, '#$1');
        (sections as any).push(`${texte}`);
      });
      sections = sections.join("\n\n")
  
      if (existsSync(mpath)) execSync(`rm -f "${mpath}"`);
      writeFileSync(mpath, sections, 'utf8');
  
      return {ok: existsSync(mpath)} as ResultType;
    } catch(error) {
      console.log("[Manual.produce] error", error);
      return {ok: false, error: (error as any).message, process: 'Manual.produce'}
    }
  }

  /**
   * Ouverture du manuel
   * (note : on le construit s'il n'existe pas)
   */
  public open(lang: string){
    const mpath = this.getPath(lang);
    existsSync(mpath) || this.produce(lang);
    execSync(`open "${mpath}"`);
  }

  private getPath(lang: string){
    return path.join(os.homedir(), 'Documents', `ETC-Manual-${lang}.md`)
  }
}
export const manual = Manual.singleton();