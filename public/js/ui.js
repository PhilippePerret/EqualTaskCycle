// public/js/dom.js
function DGet(selector, container) {
  if (container === undefined) {
    container = document.body;
  }
  return container.querySelector(selector);
}

// public/ui.ts
function stopEvent(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}

class UI {
  static instance;
  constructor() {}
  static getInstance() {
    return UI.instance || (UI.instance = new UI);
  }
  showButtons(states) {
    this.buttons.forEach((bouton) => bouton.setState(states[bouton.id]));
  }
  closeSectionWork() {
    DGet("section#work").classList.add("hidden");
  }
  openSectionWork() {
    DGet("section#work").classList.remove("hidden");
  }
  onStart(ev) {}
  onStop(ev) {}
  onPause(ev) {}
  onChange(ev) {}
  onRunScript(ev) {}
  onOpenFolder(ev) {}
  btnStart;
  btnPause;
  btnStop;
  btnChange;
  btnRunScript;
  btnOpenFolder;
  get buttons() {
    this._buttons || this.instancieButtons();
    return this._buttons;
  }
  _buttons;
  instancieButtons() {
    this._buttons = this.DATA_BUTTONS.map((bdata) => {
      let id, name, onclick, hidden, row, title;
      [id, name, onclick, hidden, row, title] = bdata;
      this[`btn${id}`] = new Button({ id, name, onclick, hidden, row, title }).build();
      return this[`btn${id}`];
    });
  }
  DATA_BUTTONS = [
    [
      "runScript",
      "RUN SCRIPT",
      this.onRunScript.bind(this),
      false,
      2,
      "Pour lancer le script défini au démarrage"
    ],
    [
      "openFolder",
      "OPEN FOLDER",
      this.onOpenFolder.bind(this),
      false,
      2,
      "Pour ouvrir le dossier défini dans les données"
    ],
    [
      "Change",
      "CHANGE",
      this.onChange.bind(this),
      false,
      2,
      "Pour changer de tâche (mais attention : une seule fois par session !"
    ],
    [
      "Pause",
      "PAUSE",
      this.onPause.bind(this),
      false,
      1,
      "Pour mettre le travail en pause."
    ],
    [
      "Stop",
      "STOP",
      this.onStop.bind(this),
      true,
      1,
      "Pour arrêter la tâche et passer à la suivante (éviter…)"
    ],
    [
      "Start",
      "START",
      this.onStart.bind(this),
      false,
      1,
      "Pour démarrer le travail sur cette tâche."
    ]
  ];
}

class Button {
  data;
  static get container() {
    return this._container || (this._container = document.body.querySelector("div#buttons-container"));
  }
  static _container;
  _obj;
  constructor(data) {
    this.data = data;
  }
  setState(state) {
    this[state ? "show" : "hide"]();
  }
  onClick(ev) {
    return stopEvent(ev);
  }
  build() {
    const o = document.createElement("BUTTON");
    o.innerHTML = this.data.name;
    o.id = `btn-${this.id}`;
    o.setAttribute("title", this.data.title);
    o.addEventListener("click", this.onClick.bind(this));
    Button.container.querySelector(`div#row${this.data.row}`).appendChild(o);
    this._obj = o;
    if (this.data.hidden) {
      this.hide();
    } else {
      this.show();
    }
    return this;
  }
  show() {
    this.obj.classList.remove("invisible");
  }
  hide() {
    this.obj.classList.add("invisible");
  }
  get id() {
    return this.data.id;
  }
  get obj() {
    return this._obj;
  }
}
var ui = UI.getInstance();
export {
  ui
};
