import type { WorkType } from "../../lib/types";

/**
 * RAPPORT DE FIN DE TÂCHE (ET DE DÉBUT DE TÂCHE FUTURE)
 * 
 * Avant d'aller enregistrer le temps après un STOP de la tâche,
 * on présent à l'utilisateur une fenêtre qui lui permet d'indiquer
 * ce qu'il y aura à faire au prochain cycle sur la tâche, pour
 * reprendre le travail plus rapidement et plus efficacement.
 * 
 * C'est cette partie qui gère ça, en permettant même de proposer
 * des questions à l'utilisateur pour savoir ce qu'il doit écrire
 * (car ce n'est jamais facile). Par exemple, d'indique le nom du
 * fichier qui sera consulté en priorité par rapport à la tâche
 * à poursuivre ou à commencer.
 */
export class EndWorkReport {

  constructor(
    private work: WorkType
  ){}

  /**
   * Méthode affichant la fenêtre pour entrer le rapport
   */
  private show(){

  }

  /**
   * Fonction construisant la fenêtre du rapport
   * 
   * NOTES
   * -----
   *  "ETR" stands for "End Task Report"
   */
  private build(){
    const o = document.createElement('div');
    this.id = `report${new Date().getTime()/1000}`;
    o.id = this.id;
    o.className = 'ETR-container';
    const rep = document.createElement('textarea');
    rep.id = `${this.id}-content`;
    rep.className = 'ETR-content';
    // Bouton pour n'enregistrer ni le temps ni le rapport
    const btnNoop = document.createElement('button');
    btnNoop.innerHTML = 'No Save No Report'
  }

  private id!: string;
  
}