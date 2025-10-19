import express from 'express';
import path from 'path';
import { PORT } from './common/constants';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import { Dialog } from "./lib/Dialog";
import { Work } from "./lib/work";


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
