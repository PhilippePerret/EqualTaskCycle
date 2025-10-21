import express from 'express';
import path from 'path';
import { HOST, PORT } from './public/js/constants';
import { Work } from "./lib/work";
import { prefs } from './lib/prefs_server_side';
import { runtime } from './lib/runtime';
import { existsSync } from 'fs';
import { execFileSync } from 'child_process';

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
    options: {canChange: true /* TODO À RÉGLER */},
    prefs: prefs.load()
  });
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
