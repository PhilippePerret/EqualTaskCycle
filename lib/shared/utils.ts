import type { RecType } from "./types.js";
import { HOST } from "../../public/js/constants.js";
import { DGet } from "../../public/js/dom.js";
// Pour remark (Markdonw => HTML)
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { t } from "./Locale.js";
import { Flash } from "../../public/js/flash.js";
// import { marked } from 'marked';
// import { gfmHeadingId } from 'marked-gfm-heading-id';
// import { markedHighlight } from 'marked-highlight';
// marked.use({ gfm: true });

export async function postToServer(route: string, data: RecType){
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30 * 60 * 1000);
  let response;
  try {
    response = await fetch(HOST+route, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => {
      console.log("r = ", r);
      switch(r.status) {
        case 500:
          return {
            ok: false, 
            error: `Internal Server Error (route: ${route}, process: ${data.process || 'inconnu (add it to data)'})`, 
            process: 'fetch'
          }
        case 404:
          return {
            ok: false,
            error: `Route not found: ${route}`,
            process: data.process
          }
        default:
          return r.json();
      }
    });
  } catch(err) {
    console.error(err);
    response = {ok: false, process: 'fetch', error: `ERREUR postToServer: ${(err as any).message}`}
  } finally {
    clearTimeout(timeoutId);
  }
  if (response.ok === false) {
    let error = response.error;
    if (null === error.match(' ')) {error = t.call(null, error)}
    let msg = `${t('error.occurred', [error])}`;
    if (response.process) { msg = `[${response.process}] ${msg}` }
    Flash.error(msg);
  }
  return response;
}

export function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
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
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)          // Support GFM (work lists, tables, etc.)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(md);  
  const html = String(result);

  // const html = marked.parse(md);

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