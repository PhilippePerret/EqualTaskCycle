// Pour remark (Markdonw => HTML)
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
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