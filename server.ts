import express from 'express';
import path from 'path';
import yaml from 'js-yaml';
import { HOST, PORT } from './public/js/constants';
import { Work } from "./lib/work";
import { prefs } from './lib/prefs_server_side';
import { runtime } from './lib/runtime';
import { existsSync, readFileSync } from 'fs';
import { execFileSync, execSync } from 'child_process';
import type { RecType, WorkType } from './lib/types';
import { activTracker } from './lib/activityTracker';
import { loc, tf } from './lib/Locale';

const app = express();

app.get('/', (req, res) => {
  console.log("-> route /")
  loc.init('fr');
  res.send(tf(path.join(__dirname, 'public', 'main.html')));
});

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('public'));

function log(msg: string, data: any = undefined) {
  if (data) {
    console.log(msg, data);
  } else {
    console.log(msg);
  }
}

app.post('/work/check-activity', async (req, res) => {
  log("-> /work/check-activity");
  req.setTimeout(30 * 60 * 1000);
  res.setTimeout(30 * 60 * 1000);
  let response: RecType;
  try {
    const dreq = req.body;
    const folder: string = dreq.projectFolder;
    const lastCheck = dreq.lastCheck;
    const isActive = await activTracker.watchActivity(folder, lastCheck);
    log('Données:', {isActive, folder, lastCheck, date: new Date(lastCheck)});
    if (!isActive) {
      log("-> Alerte pour demander de confirmer le travail.");
      response = await activTracker.askUserIfWorking();
      // response = {ok: true, userIsWorking: true}; // pour essayer sans l'appel
      log("Réponse de l'utilisateur : ", response);
    } else {
      response = {ok: true, userIsWorking: true, raison: 'acitivity in folder'};
    }
  } catch (err) {
    console.error("ERREURS IN /work/check-activity", err);
    response = {ok: false, error: (err as any).message }
  }
  res.json(response);
});

app.post('/work/save-session', (req, res) => {
  log("-> /work/save-session");
  const dwork = req.body;
  log("Sauvegarde de la session : ", dwork);
  runtime.updateWork(dwork);
  res.json({
    ok: true, 
    next: Work.getCurrentWork(),
    options: {canChange: true /* TODO: À régler */}
  });
});

app.get('/task/current', (req, res) => {
  log("-> /task/current");
  res.json({
    task: Work.getCurrentWork(),
    options: {
      canChange: runtime.lastChangeIsFarEnough()
    },
    prefs: prefs.load()
  });
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
  // console.log("Je dois jouer le script", dreq.script);
  if (existsSync(dreq.script)) {
    try {
      const res = execFileSync(dreq.script, {encoding: 'utf8'});
      console.log("Résultat du script", res);
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
  if (runtime.lastChangeIsFarEnough()) {
    const retour = Work.getCurrentWork({but: dreq.taskId});
    // choisir une autre
    if (retour.ok === false) {
      result = {
        ok: false, 
        error: 'No other tasks found. You must complete that one.',
        task: Work.get(dreq.taskId).dataForClient
      }
    } else {
      Object.assign(result, {task: retour as RecType & WorkType})
    }
    // Enregistrer la transaction
    runtime.setLastChange();
  } else {
    result = {ok: false, error: 'Task has been already changed today.'}
  }
  res.json(result);
});

app.post('/tasks/all', (req, res) => {
  const dreq = req.body;
  let retour: RecType = {ok: true, error: ''}
  const dataPath = dreq.dataPath;
  if (existsSync(dataPath)) {
    retour = {ok: true, data: yaml.load(readFileSync(dataPath,'utf8'))};
  } else {
    retour = {ok: false, error: 'Data File Unfound : ' + dataPath};
  }
  res.json(retour);
})

app.post('/tasks/save', (req, res) => {
  const allData = req.body;
  let retour = {ok: true, error: ''};
  Work.saveAllData(allData);
  res.json(retour);
})

app.post('/prefs/open-data-file', (req, res) => {
  const dreq = req.body;
  const fpath = dreq.filePath
  let report = {ok: true, error: ''};
  if (existsSync(fpath)) {
    try {
      execSync(`open "${fpath}"`);
    } catch(err) {
      console.log('ERR: ' + err);
      report = {ok: false, error: 'ERROR DURING OPEN DATA FILE (see console)'}
    }
  } else {
    report = {ok: false, error: 'File "'+fpath+'" unfound…'}
  }
  res.json(report);
})
app.post('/prefs/save', (req, res) => {
  const report = prefs.save(req.body);
  res.json(report);
});

app.post('/localization/get-all', (req, res) => {
  const lang = req.body.lang;
  let retour = {ok: true, error: '', locales: loc.getLocales()};
  res.json(retour);
});

app.post('/tool/reset-cycle', async (req, res) => {
  console.log("-> /tool/reset-cycle")
  const data = req.body;
  res.json(Object.assign(data, {ok: false, error: 'Pour faire une erreur'}))
  // const { tools } = await require('public/tools.ts');
  // console.log("Module tools chargé")
  // tools.run_ResetCycle(req.body, res);
})


app.listen(PORT, () => {
  console.log(`Server running on ${HOST}`);
});
