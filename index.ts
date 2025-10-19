import express from 'express';
import path from 'path';
import { PORT } from './public/constants';
import { Dialog } from "./lib/Dialog";
import { Work } from "./lib/work";


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
  // res.json(Work.getAll());
  console.log("Je dois envoyer la tâche courante");
  res.json({task: {name: "Son nom", id: "Son id etc.", content: "Le contenu exact de la tâche, du travail."}});
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
