import type { RecType } from "./types";
import path from 'path';
import yaml from 'js-yaml';
import { readFileSync } from "fs";

const LOCALES_FOLDER = path.resolve(path.join(__dirname,'locales'));

// const SERVER_SIDE = typeof window === 'undefined';

/**
 * Service de LOCALISATION
 * 
 */
export function t(route: string, params?: string[]): string {
  console.log("route = '%s'", route, params);
  if (params) {
    const template = loc.translate(route);
    for(var i in params){
      const regexp = new RegExp(`_${i}_`, 'g');
      template.replace(regexp, params[i] as string);
    }
    return template;
  } else {
    return loc.translate(route);
  }
}
export function tf(fpath: string) {
  // return readFileSync(fpath, 'utf8');
  return loc.translateText(readFileSync(fpath, 'utf8'));
}

class Locale {

  public getLocales(){
    return this.locales;
  }

  public translateText(texte: string){
    console.log("-> Locale.translateText")
    return texte.replace(/\bt\((.+?)\)/g, this.replacementMethod.bind(this));
  }

  /**
   * @api
   * 
   * Reçoit une route et retourne la valeur locale.
   */
  public translate(route: string): string {
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
  public async init(lang: string){
    console.log("Initialisation des locales (%s)", lang);
    if ( typeof window === 'undefined' /* server side */) {
      this.locales = {}
      const folderLang = path.join(LOCALES_FOLDER, lang);
      ['messages', 'ui'].forEach((base: string) => {
        const pathLocale = path.join(folderLang, `${base}.yaml`)
        Object.assign(this.locales, yaml.load(readFileSync(pathLocale, 'utf8')));
      })
    } else {
      /* client side */
      const { postToServer } = await import("../public/utils");
      const { prefs } = await import("../public/prefs");
      const { Flash } = await import("../public/js/flash");

      const retour = await postToServer('localization/get-all', {lang: prefs.getLang()});
      if (retour.ok) {
        this.locales = retour.locales;
      } else {
        Flash.error('Impossible to load locales… I can only speaking english, sorry…');
      }
    }
    console.log("Toutes les locales : ", this.locales);
  }
  private locales!: RecType;


  private constructor(){}
  public static getInstance(){return this.inst || (this.inst = new Locale())}
  private static inst: Locale;
}

export const loc = Locale.getInstance();