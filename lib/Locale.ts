import type { RecType } from "./types";
import path from 'path';
import yaml from 'js-yaml';
import { readFileSync } from "fs";

const LOCALES_FOLDER = path.resolve(path.join(__dirname,'locales'));

/**
 * Service de LOCALISATION
 * 
 */
export function t(route: string, params?:RecType): string {
  return loc.translate(route, params);
}
export function tf(fpath: string) {
  // return readFileSync(fpath, 'utf8');
  return loc.translateText(readFileSync(fpath, 'utf8'));
}

class Locale {

  public translateText(texte: string){
    console.log("-> Locale.translateText")
    return texte.replace(/\bt\((.+?)\)/g, this.replacementMethod.bind(this));
  }

  /**
   * @api
   * 
   * Reçoit une route et retourne la valeur locale.
   */
  public translate(route: string, _params?: RecType): string {
    const translated = route.split('.').reduce((obj, key) => obj?.[key], this.locales) ;
    return 'string' === typeof translated ? translated : `[UNFOUND: ${route}]`;
  }


  private replacementMethod(tout: string, route:string): string {
    console.log("Tout = ", tout);
    console.log("Traduction de %s = ", route, this.translate(route));
    return this.translate(route);
  }

  /**
   * Initialisation des locales
   * Consiste principalement à charger le fichier des locales
   */
  public init(lang: string){
    console.log("Initialisation des locales (%s)", lang);
    this.locales = {}
    const folderLang = path.join(LOCALES_FOLDER, lang);
    ['messages', 'ui'].forEach((base: string) => {
      const pathLocale = path.join(folderLang, `${base}.yaml`)
      Object.assign(this.locales, yaml.load(readFileSync(pathLocale, 'utf8')));
    })
  }
  private locales!: RecType;


  private constructor(){}
  public static getInstance(){return this.inst || (this.inst = new Locale())}
  private static inst: Locale;
}

export const loc = Locale.getInstance();