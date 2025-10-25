import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import type { RecType } from '../lib/types';
import { blue, green, red, subTitleize } from '../public/utils';
import { loc, t } from '../lib/Locale';

loc.init('en');

console.clear();
console.log("\n\n" + blue(t('locales.check')));

const FOLDERS = [
  'lib', 'public', 'scripts'
];

const EXTENSIONS: RecType = {};
['.ts', '.js', 'md', '.html', '.htm'].forEach((ext: string) => {
  Object.assign(EXTENSIONS, {[ext]: true});
})

const COLLECTED_ROUTES: RecType = {};

FOLDERS.forEach((folder: string) => {
  const dpath = path.resolve(path.join('.', folder));
  // console.log("dpath = ", dpath);
  const entries = fs.readdirSync(dpath, {encoding: 'utf8', recursive: true})
  // console.log("entries = ", entries.length);
  entries.forEach((entry: string) => {
    const ext = path.extname(entry);
    const fpath = path.join(folder, entry);
    if (EXTENSIONS[ext] !== true ) { return }
    // console.log("entry:", entry);
    // console.log("-> Doit être traité");
    const code = fs.readFileSync(fpath, 'utf8');
    if ( code.match(/t\(/) === null ) { return }
    code.matchAll(/\bt\((["'])?([a-zA-Z0-9_\.]+?)\1?(\)|\,.+?\))/g).forEach((found: RegExpExecArray) => {
      let route: string | undefined, params: string | undefined;
      [route, params] = (found[2] as string).split(',');
      if (route && route !== 'route' /* la fonction elle-même */) {
        if ( undefined === COLLECTED_ROUTES[route]) {
          Object.assign(COLLECTED_ROUTES, {[route]: {files: [], defined: true}})
        }
        COLLECTED_ROUTES[route].files.push(fpath);
      }
    })
  })
});

// console.log("\n\n------------\nRoutes collectées", COLLECTED_ROUTES);

const UNKNOWN_ROUTES: RecType = {};
/**
 * Maitenant qu'on a relevé les routes, on regarde celles qu'on connait
 */
['en', 'fr'].forEach((lang: string) => {

  const langFolder = path.join('.', 'lib', 'locales', lang);
  const LOCALES = {};
  fs.readdirSync(langFolder, {encoding: 'utf8'})
  .forEach((fname: string) => {
    const fpath = path.join(langFolder, fname);
    Object.assign(LOCALES, yaml.load(fs.readFileSync(fpath, 'utf8')));
  })

  for(var route in COLLECTED_ROUTES){
    route = route as string;
    const translated = route.split('.').reduce((obj: any, key: string) => obj?.[key], LOCALES) ;
    if ('string' !== typeof translated) {
      const data = COLLECTED_ROUTES[route];
      // console.log("ROUTE INCONNUE: %s", route, data.files);
      if (undefined === UNKNOWN_ROUTES[route]) {
        Object.assign(UNKNOWN_ROUTES, {[route]: {langs: [], data: data}});
      }
      UNKNOWN_ROUTES[route].langs.push(lang);
    }
  }
});

// ================ REPORT ==================

let titre = subTitleize(t('locales.report.title'));
console.log(blue(`\n\n${titre}`));
console.log(blue(`${t('locales.report.count')}${t('space')}: ${Object.keys(COLLECTED_ROUTES).length}`));
const nombreUnknown = Object.keys(UNKNOWN_ROUTES).length;
let msgRes;
if ( nombreUnknown ) {
  msgRes = red(`${t('locales.report.unknown_count')}${t('space')}: ${nombreUnknown}`);
} else {
  msgRes = green(`${t('locales.report.all_are_known')}`);
}
console.log(msgRes);

if (nombreUnknown) {
  titre = subTitleize(t('locales.report.loc_to_create'));
  console.log(blue(titre)) ;
  for (var route in UNKNOWN_ROUTES) {
    const langs = UNKNOWN_ROUTES[route].langs;
    console.log(red(`- ${route} (${langs.join(' + ')})`));
  }
}