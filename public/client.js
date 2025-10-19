// public/constants.js
var PORT = 3002;

// public/client.ts
var HOST = `http://localhost:${PORT}/`;

class Work {
  data;
  static currentWork;
  static get obj() {
    return this._obj || (this._obj = document.body.querySelector("section#current-work-container"));
  }
  static _obj;
  static async getCurrent() {
    const retour = await fetch(HOST + "task/current").then((r) => r.json());
    const dataCurrentWork = retour.task;
    this.currentWork = new Work(dataCurrentWork);
    this.currentWork.display();
  }
  constructor(data) {
    this.data = data;
  }
  display() {
    console.log("Je dois apprendre à afficher le travail : ", this.data);
    this.dispatchData();
  }
  dispatchData() {
    Object.entries(this.data).forEach(([k, v]) => {
      const propField = this.field(k);
      if (propField) {
        propField.innerHTML = v;
      }
    });
  }
  field(prop) {
    return Work.obj.querySelector(`#current-work-${prop}`);
  }
}
await fetch(HOST + "api/task/start", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: 123 })
});
Work.getCurrent();
