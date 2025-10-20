import express from 'express';
import path from 'path';
import { HOST, PORT } from './public/js/constants';
import { Dialog } from "./lib/Dialog";
import { Work } from "./lib/work";
import { prefs } from './lib/prefs_server';

const userDataPath = process.env.USER_DATA_PATH

const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/task/start', (req, res) => {
  const { taskId } = req.body;
  // ... ton traitement
  res.json({ success: true, data: {ok: true} });
});

app.get('/task/current', (req, res) => {
  // TODO Envoyer la tâche courante et ses options
  // TODO Il faut donc implémenter l'algorithme de choix de
  // la tâche
  res.json({
    task: {project: "Son nom", id: "Son id etc.", content: "Le contenu exact de la tâche, du travail."},
    options: {canChange: true /* TODO À RÉGLER */}
  });
});

app.post('/prefs/save', (req, res) => {
  const report = prefs.save(req.body);
  res.json(report);
});


app.listen(PORT, () => {
  console.log(`Server running on ${HOST}`);
});



/**
 * Ici on doit amorcer une boucle de travail
 */
class DayWork {
  private currentWork?: Work;

  constructor(){}
  start() {
    Work.init();
    this.chooseAndStartWork()
  }
  chooseAndStartWork(){
    this.currentWork = Work.random();
    if (this.currentWork) {
      this.startCurrentWork();
    } else {
      this.showDialogNoTask();
    }
  }

  startCurrentWork(){
    if (this.currentWork) {
      this.currentWork.start();
    }
  }

  showDialogNoTask(){
    if ( undefined === this.dialogNoTask) {
      this.dialogNoTask = new Dialog({
        title: "Aucune tâche",
        message: "Aucune tâche à travailler n'a été trouvée.",
        buttons: [{text: "OK", onclick: ()=>{}}],
        icon: 'caution',
        timeout: 60
      })
    }
    this.dialogNoTask.show();
  }
  private dialogNoTask?: Dialog;
}

const daywork = new DayWork();
daywork.start();
