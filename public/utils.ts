import type { RecType } from "../lib/types";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";

export async function postToServer(route: string, data: RecType){
  if (route.startsWith('/')){ route = route.substring(1, route.length)}
  return await fetch(HOST+route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

/**
 * Pour faciliter l'observation des clicks sur les boutons.
 * 
 * Le bouton doit obligatoire avoir une classe qui commence par
 * 'btn-' suivi de son "id"
 * La fonction doit être bindée
 */
export function listenBtn(id: string, method: Function, container = document.body) {
    DGet(`button.btn-${id}`, container).addEventListener("click", method);
  }