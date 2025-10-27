import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

class Manual { /* singleton */
  private static inst: Manual;
  private constructor(){}
  public static singleton(){return this.inst || (this.inst = new Manual())}

  /**
   * Construction du manuel
   */
  public produce(lang: string){
    const mpath = this.getPath(lang);
    // TODO le construire
    // writeFileSync(mpath, "# Manual\n\n", 'utf8');

    return existsSync(mpath);
  }

  /**
   * Ouverture du manuel
   * (note : on le construit s'il n'existe pas)
   */
  public open(lang: string){
    const mpath = this.getPath(lang);
    existsSync(mpath) || this.produce(lang);
    execSync(`open -a Finder "${mpath}"`);
  }

  private getPath(lang: string){
    return path.join(os.homedir(), 'Documents', `ETC-Manual-${lang}.md`)
  }
}
export const manual = Manual.singleton();