import express from 'express';
import path from 'path';
import yaml from 'js-yaml';
import { HOST, PORT } from '../../public/js/constants';
import { Work } from "./work";
import { prefs } from './prefs';
import { existsSync, readFileSync } from 'fs';
import { execFileSync, execSync } from 'child_process';
import type { RecType, WorkType } from '../shared/types';
import { activTracker } from './activityTracker';
import { loc, t, tf } from '../shared/Locale';
import log from 'electron-log/main';
import { manual } from './Manual';
import db from './db';

const app = express();
const APP_PATH = path.resolve('.');
console.log("APP_PATH = %s", APP_PATH);
const MAIN_HTML_FILE = path.join(APP_PATH, 'public', 'main.html');
console.log("MAIN_HTML_FILE = %s", MAIN_HTML_FILE);


app.get('/', (_req, res) => {
  // log("-> route /")
  log.info("->route /");
  prefs.load();
  loc.init(prefs.data.lang);
  db.init();
  res.send(tf(MAIN_HTML_FILE));
});

// app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('public'));

app.post('/prefs/load', (req, res) => {
  log.info('->route /prefs/load');
  const data = req.body // process seulement
  const dprefs = prefs.loaded ? prefs.data : prefs.load();
  Object.assign(data, {
    ok: true, 
    prefs: dprefs
  });
  res.json(data)
});

app.post('/work/check-activity', async (req, res) => {
  log.info("->route /work/check-activity");
  req.setTimeout(30 * 60 * 1000);
  res.setTimeout(30 * 60 * 1000);
  let response: RecType = {};
  try {
    const dreq = req.body;
    const folder: string = dreq.projectFolder;
    const lastCheck = dreq.lastCheck;
    const isActive = await activTracker.watchActivity(folder, lastCheck);
    log.info('Data watcher activity:', {isActive, folder, lastCheck, date: new Date(lastCheck)});
    if (isActive === false) {
      // TODO Activer l'application pour voir le dialogue
    }
    response = {ok: true, isActive: isActive}
  } catch (err) {
    log.error("ERREURS IN /work/check-activity", err);
    response = {ok: false, error: (err as any).message }
  }
  res.json(response);
});

app.post('/work/save-session', (req, res) => {
  log.info("-> /work/save-session");
  const dwork = req.body;
  log.info("Sauvegarde de la session : ", dwork);
  db.updateWorkTimes(dwork);
  res.json({
    ok: true,
    next: Work.getCurrentWork(),
    options: {canChange: db.lastChangeIsFarEnough()}
  });
});

app.post('/task/get-current', (req, res) => {
  log.info("-> /task/get-current");
  let result = {ok: true, error: ''};
  const options = req.body
  try {
    Object.assign(result, {
      task: Work.getCurrentWork(options),
      options: { canChange: db.lastChangeIsFarEnough()}
    });
  } catch(err) {
    result = {ok: false, error: (err as any).message}
  }
  res.json(result);
});

app.post('/task/open-folder', (req, res) => {
  const dreq = req.body;
  let result = {ok: true, error: ''};
  if (existsSync(path.resolve(dreq.folder))) {
    try {
      execSync(`open -a Finder "${dreq.folder}"`);
    } catch(err: any) {
      console.error("ERREUR OUVERTURE FOLDER: ", err);
      result = {ok: false, error: String(err.stderr)}
    }
  } else {
    result = {ok: false, error: 'Unfound folder ' + dreq.folder};
  }
  res.json(result);
});

app.post('/task/run-script', (req, res) => {
  const dreq = req.body;
  let result = {ok: true, error: ''};
  dreq.script = path.resolve(dreq.script);
  // log.info("Je dois jouer le script", dreq.script);
  if (existsSync(dreq.script)) {
    try {
      const res = execFileSync(dreq.script, {encoding: 'utf8'});
      log.info("Résultat du script", res);
    } catch(err: any) {
      result = {ok: false, error: err.stderr}
    }
  } else {
    result = {ok: false, error: 'Script "'+dreq.script+'"unfound.'}
  }
  res.json(result);
})
app.post('/task/change', (req, res) => {
  const dreq = req.body;
  let result: {
    ok: boolean,
    error: string,
    task?: RecType & WorkType
  } = {ok: true, error: '', task: undefined};

  // Est-ce qu'on peut changer la tâche ?
  if (db.lastChangeIsFarEnough()) {
    const retour = Work.getCurrentWork({but: dreq.taskId});
    // choisir une autre
    if ((retour as any).ok === false) {
      result = {
        ok: false,
        error: t('error.no_other_task_complete_that_one'),
        task: Work.get(dreq.taskId)
      }
    } else {
      Object.assign(result, {task: retour as WorkType})
    }
    // Enregistrer la transaction
    db.setLastChange();
  } else {
    result = {ok: false, error: t('error.task_already_changed_today')}
  }
  res.json(result);
});

// Retourne toutes les tâches, mais seulement les
// information dans le fichier des données, pas les
// temps.
app.post('/tasks/all', (req, res) => {
  const dreq = req.body;
  Object.assign(dreq, {ok: true, works: db.getAllWorks()})
  res.json(dreq);
});

app.post('/tasks/get-all-data', (req, res) => {
  const data: RecType = req.body;
  const works = db.getAllActiveWorks();
  res.json(Object.assign(data, {
    ok: true,
    works: works,
  }));
});

app.post('/tasks/save', (req, res) => {
  const allData = req.body;
  let retour = {ok: true, error: ''};
  Work.saveAllData(allData);
  res.json(retour);
});

app.post('/prefs/save', (req, res) => {
  const report = prefs.save(req.body);
  res.json(report);
});

app.post('/localization/get-all', (req, res) => {
  log.info("->route /localization/get-all")
  const lang = req.body.lang;
  let retour = {ok: true, error: '', locales: loc.getLocales()};
  retour.locales.ui.app.mode = process.env.ETC_MODE;
  res.json(retour);
});

app.post('/tool/reset-cycle', async (req, res) => {
  log.info("->route /tool/reset-cycle")
  const data = req.body;
  const {ok, error} = db.resetCycle();
  res.json(Object.assign(data, {ok, error}));
});

app.post('/manual/produce', (req, res) => {
  log.info('->route /manual/produce');
  const data = req.body;
  if (manual.produce(data.lang)) {
    return res.json(Object.assign(data, {ok: true}));
  } else {
    return res.json(Object.assign(data, {ok: false, error: 'manual.not_produced'}))
  }
});

app.post('/manual/open', (req, res) => {
  log.info('->route /manual/open');
  const lang = req.body.lang;
  manual.open(lang);
  return {ok: true}
})


app.listen(PORT, () => {
  log.info(`Server running on ${HOST}`);
});
