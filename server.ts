import express from 'express';
import path from 'path';
import { HOST, PORT } from './public/js/constants';
import { Work } from "./lib/work";
import { prefs } from './lib/prefs_server_side';
import { runtime } from './lib/runtime';
import { existsSync } from 'fs';
import { execFileSync, execSync } from 'child_process';
import type { RecType, WorkType } from './lib/types';
import { activTracker } from './lib/activityTracker';

const app = express();

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
  const dreq = req.body;
  const folder: string = dreq.projectFolder;
  const lastCheck = dreq.lastCheck;
  const isActive = await activTracker.watchActivity(folder, lastCheck);
  console.log('isActive:', isActive, 'folder:', folder, 'lastCheck:', lastCheck, 'date', new Date(lastCheck));
  let response: RecType;
  if (!isActive) {
    console.log("-> Alerte pour demander de confirmer le travail.");
    response = await activTracker.askUserIfWorking();
    console.log("Réponse de l'utilisateur : ", response);
  } else {
    response = {userIsWorking: true};
  }
  res.json(response)
});

app.post('/work/save-times', (req, res) => {
  log("-> /work/save-times");
  const dwork = req.body;
  log("Sauvegarde des temps : ", dwork);
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on ${HOST}`);
});
