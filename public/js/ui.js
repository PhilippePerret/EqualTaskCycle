// public/js/dom.js
function DGet(selector, container) {
  if (container === undefined) {
    container = document.body;
  }
  return container.querySelector(selector);
}

// lib/Clock.ts
class Clock {
  static time2horloge(mn) {
    let hrs = Math.floor(mn / 60);
    let mns = mn % 60;
    let horloge = [];
    mns > 0 && horloge.push(`${mns} mns`);
    hrs > 0 && horloge.push(`${hrs} hrs`);
    if (horloge.length) {
      return horloge.join(" ");
    } else {
      return "---";
    }
  }
  static setClockStyle(style) {
    this.clockObj.classList.add(style);
  }
  static start() {
    this.clockObj.classList.remove("hidden");
    this.clockObj.innerHTML = "0:00:00";
    this.startTime = new Date().getTime();
    this.timeLeft = 0;
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  static timer;
  static startTime;
  static timeLeft;
  static pause() {
    clearInterval(this.timer);
    this.timeLeft += this.lapsFromStart();
  }
  static stop() {
    clearInterval(this.timer);
    this.clockObj.classList.add("hidden");
  }
  static run() {
    this.clockObj.innerHTML = this.s2h(this.timeLeft + this.lapsFromStart());
  }
  static lapsFromStart() {
    return Math.round((new Date().getTime() - this.startTime) / 1000);
  }
  static get clockObj() {
    return this._clockobj || (this._clockobj = DGet("#clock"));
  }
  static _clockobj;
  static s2h(s) {
    let h = Math.floor(s / 3600);
    s = s % 3600;
    let m = Math.floor(s / 60);
    const mstr = m < 10 ? `0${m}` : String(m);
    s = s % 60;
    const sstr = s < 10 ? `0${s}` : String(s);
    return `${h}:${mstr}:${sstr}`;
  }
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
  startDate;
  stopDate;
  pauseDate;
  onStart(ev) {
    this.startDate = new Date;
    Clock.start();
  }
  onStop(ev) {
    this.stopDate = new Date;
    Clock.stop();
  }
  onPause(ev) {
    this.pauseDate = new Date;
    Clock.pause();
  }
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
    console.log("Click sur le bouton", this);
    this.data.onclick();
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
