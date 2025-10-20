import express from 'express';
import path from 'path';
import { HOST, PORT } from './public/js/constants';
import { Work } from "./lib/work";
import { prefs } from './lib/prefs_server_side';

const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('public'));


app.post('/api/task/start', (req, res) => {
  const { taskId } = req.body;
  // ... ton traitement
  res.json({ success: true, data: {ok: true} });
});

app.get('/task/current', (req, res) => {
  console.log("-> /task/current")
  res.json({
    task: Work.getCurrentWork(),
    options: {canChange: true /* TODO À RÉGLER */},
    prefs: prefs.load()
  });
});

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
