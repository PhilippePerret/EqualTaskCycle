import db from "./db";
import { prefs } from "./prefs";
import { DEFAULT_WORK, type RecType, type WorkType } from "../shared/types";
import { t } from '../shared/Locale';
import { startOfToday } from "../shared/utils_shared";
import log from 'electron-log/main';

export class Work /* server */ {
  public static defaultDuration: number;

  /**
   * Initialisation de l'application (au niveau des travaux)
   */
  public static init() {
    this.defaultDuration = prefs.data.duree;
    this.prepareDefaultWork(this.defaultDuration);
  }
  private static prepareDefaultWork(dureeDefault: number){
    Object.assign(DEFAULT_WORK, {
      defaultLeftTime: dureeDefault,
      leftTime: dureeDefault
    })
  }

  public static get(workId: string): WorkType {
    return db.getWork(workId) as WorkType;
  }

  /**
   * Retourne le travail courant, le travail à faire.
   */
  public static getCurrentWork(options: RecType | undefined = {}): WorkType | {ok: boolean, error: string} {
    log.info("-> getCurrentWork")
    const filtre: string | string[] = []
    filtre.push('active = 1 AND leftTime > 0');
    if (options.no_lasttime_constraint !== true) {
      filtre.push(`(lastWorkedAt IS NULL OR lastWorkedAt <= ${startOfToday()})`);
    }
    let candidats = db.findAll(filtre.join(' AND '));
    if (options.but) {
      candidats = candidats.filter((work: WorkType) => work.id !== options.but)
    }
    console.log("candidats", candidats)
    // Traitement en fonction du nombre de candidats
    const candidatsCount = candidats.length;
    if (candidatsCount > 0) {
      if (candidatsCount === 1) {
        return candidats[0] as WorkType;
      } else if (prefs.data.random) {
        return candidats[Math.floor(Math.random() * candidatsCount)] as WorkType;
      } else if (prefs.data.shortest) {
        return candidats[0] as WorkType;
      } else {
        return candidats.pop() as WorkType;
      }
    } else if (this.deuxiemeFois === false) {
      /* Traitement spécial en cas d'absence de candidats, pour
       * savoir s'il faut updater le cycle, etc.
       */
      if (this.noActiveWork()) {
        // <= Pas de tâche active
        // => C'est une erreur handicapante
        return {ok: false, error: t('work.any_active')}
      } else if (this.noWorkWithRestTime()) {
        // <= Plus aucune tâche active n'a de leftTime
        // => On initie un nouveau cycle
        db.resetCycle();
        return this.getCurrentWork(options)
      } else {
        // <= Il y a des tâches avec du leftTime, mais elles ont
        //    été déjà jouées aujourd'hui.
        // => On baisse la contrainte
        return this.getCurrentWork(Object.assign(options, {no_lasttime_constraint: true}))
      }
    } else if (this.deuxiemeFois === true) {
      // Normalement impossible…
    }
    return {ok: false, error: 'Ça ne doit pas pouvoir arriver'}
  }; 
  private static deuxiemeFois: boolean = false;

  private static noActiveWork(): boolean {
    return db.findAll('active = 1').length === 0;
  }
  private static noWorkWithRestTime(): boolean {
    return db.findAll('active = 1 AND leftTime > 0').length === 0;
  }

  constructor(
    private data: WorkType
  ){}

  public getData(){return this.data}

  // raccourcis
  public get id(){ return this.data.id; }

}