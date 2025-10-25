import type { RecType } from "../lib/types";
import { HOST } from "./js/constants";
import { DGet } from "./js/dom";
// Pour remark (Markdonw => HTML)
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

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

export function markdown(md: string): string {
  // Ajouter deux '#' à chaque titre
  md = md.replace(/^(\#+?)/mg, '$1##');
  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(md);
  
  const html = String(result);

  // console.log("Report corrigé", html);
  return html; 
}

export function red(msg: string) {
  return colorize(msg, '31');
}
export function green(msg: string){
  return colorize(msg, '32');
}
export function blue(msg: string){
  return colorize(msg, '34');
}
function colorize(msg: string, color: string){
  return `\x1b[${color}m${msg}\x1b[0m`;
}

export function subTitleize(titre: string, car: string = '-'){
  return titre + "\n" + (new Array(titre.length + 1)).join(car);
}