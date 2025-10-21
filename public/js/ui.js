// public/js/dom.js
function DGet(selector, container) {
  if (container === undefined) {
    container = document.body;
  }
  return container.querySelector(selector);
}
function stopEvent(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}

// lib/Clock.ts
class Clock {
  static time2horloge(mn) {
    let hrs = Math.floor(mn / 60);
    let mns = mn % 60;
    let horloge = [];
    hrs > 0 && horloge.push(`${hrs}`);
    mns > 0 && horloge.push(`${mns}`);
    if (horloge.length) {
      return horloge.join(":") + "00";
    } else {
      return "---";
    }
  }
  static setClockStyle(style) {
    this.clockObj.classList.add(style);
  }
  static timer;
  static startTime;
  static timeLeft;
  static totalTime;
  static start() {
    this.clockObj.classList.remove("hidden");
    if (this.timeLeft === undefined) {
      this.timeLeft = 0;
      this.clockObj.innerHTML = "0:00:00";
    }
    this.startTime = new Date().getTime();
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  static getStartTime() {
    return this.startTime;
  }
  static pause() {
    clearInterval(this.timer);
    this.timeLeft += this.lapsFromStart();
  }
  static stop() {
    clearInterval(this.timer);
    this.totalTime = this.timeLeft + this.lapsFromStart();
    this.timeLeft = undefined;
    this.clockObj.classList.add("hidden");
    return this.totalTime;
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

// public/js/constants.js
var PORT = 3002;
var HOST = `http://localhost:${PORT}/`;

// public/js/flash.js
class Flash {
  static init() {}
  static checkServerMessages() {
    const divMsg = DGet("div#flash-group div#flash-info");
    if (divMsg) {
      const content = DGet("p.message", divMsg).innerHTML;
      DGet("button", divMsg).remove();
      this.temporize(divMsg, this.calcReadingTime(content));
    }
  }
  static temporize(domMessage, readingTime) {
    this.timer = setTimeout(this.removeServerMessage.bind(this, domMessage), 2000 + readingTime);
  }
  static removeServerMessage(domE, ev) {
    domE.remove();
    this.timer && clearTimeout(this.timer);
    delete this.timer;
  }
  static calcReadingTime(str) {
    return str.split(" ").length * 300 * 4;
  }
  static notice(message) {
    this.buildMessage({ content: message, type: "notice" });
  }
  static info(message) {
    return this.notice(message);
  }
  static success(message) {
    this.buildMessage({ content: message, type: "success" });
  }
  static warning(message) {
    this.buildMessage({ content: message, type: "warning" });
  }
  static error(message) {
    this.buildMessage({ content: message, type: "error" });
  }
  static buildMessage(data) {
    new FlashMessage(data);
  }
  static removeMessage(message) {
    if (message.type != "error") {
      clearTimeout(message.timer);
      message.timer = null;
    }
    message.obj.remove();
    message = undefined;
  }
  static get conteneur() {
    return this._maincont || (this._maincont = DGet("#flash-group"));
  }
}

class FlashMessage {
  constructor(data) {
    this.data = data;
    this.build();
    this.show();
    if (this.type != "error")
      this.temporize();
    this.observe();
  }
  build() {
    const msg = document.createElement("DIV");
    msg.className = `flash-message ${this.type}`;
    msg.innerHTML = this.content;
    this.obj = msg;
  }
  show() {
    Flash.conteneur.appendChild(this.obj);
  }
  observe() {
    this.obj.addEventListener("click", this.onClick.bind(this));
  }
  onClick(ev) {
    Flash.removeMessage(this);
  }
  temporize() {
    this.timer = setTimeout(Flash.removeMessage.bind(Flash, this), 2000 + this.readingTime);
  }
  get readingTime() {
    return Flash.calcReadingTime(this.content);
  }
  get content() {
    return this.data.content;
  }
  get type() {
    return this.data.type;
  }
}

// public/prefs.ts
class Prefs {
  data;
  fieldsReady = false;
  static instance;
  constructor() {}
  static getInstance() {
    return this.instance || (this.instance = new Prefs);
  }
  init() {
    this.observeButtons();
  }
  async onSave(ev) {
    stopEvent(ev);
    const result = await fetch(HOST + "prefs/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.getData())
    }).then((r) => r.json());
    if (result.ok) {
      this.close();
      Flash.success("Preferences saved.");
    } else {
      Flash.error(result.errors);
    }
    return false;
  }
  onChangePref(prop, ev) {
    const value = this.getValue(prop);
    switch (prop) {
      case "clock":
        Clock.setClockStyle(value);
        break;
      case "theme":
        ui.setUITheme(value);
        break;
      default:
    }
  }
  onOpen(ev) {
    this.open();
    return stopEvent(ev);
  }
  onClose(ev) {
    this.close();
    return stopEvent(ev);
  }
  setData(data) {
    this.data = data;
    this.fieldsReady || this.observeFields();
    Object.entries(this.data).forEach(([k, v]) => {
      this.setValue(k, v);
    });
  }
  getData() {
    Object.entries(this.data).forEach(([k, _v]) => {
      Object.assign(this.data, { [k]: this.getValue(k) });
    });
    return this.data;
  }
  getValue(prop) {
    switch (prop) {
      case "random":
        return this.field("random").checked;
      default:
        return this.field(prop).value;
    }
  }
  setValue(prop, value) {
    switch (prop) {
      case "random":
        this.field("random").checked = value;
        break;
      default:
        this.field(prop).value = value;
    }
  }
  field(key) {
    return DGet(`#prefs-${key}`, this.section) || console.error("Le champ 'prefs-%s' est introuvable", key);
  }
  close() {
    ui.openSectionWork();
    this.section.classList.add("hidden");
  }
  open() {
    this.section.classList.remove("hidden");
    ui.closeSectionWork();
  }
  observeButtons() {
    DGet("button.btn-prefs").addEventListener("click", this.onOpen.bind(this));
    DGet("button.btn-close-prefs").addEventListener("click", this.onClose.bind(this));
    DGet("button.btn-save-prefs").addEventListener("click", this.onSave.bind(this));
  }
  observeFields() {
    Object.keys(this.data).forEach((prop) => {
      this.field(prop).addEventListener("change", this.onChangePref.bind(this, prop));
    });
    this.fieldsReady = true;
  }
  get section() {
    return DGet("section#preferences");
  }
}
var prefs = Prefs.getInstance();

// public/client.ts
class Work {
  data;
  static async init() {
    const res = await this.getCurrent();
    if (res === true) {
      prefs.init();
      Flash.notice("App is ready.");
    }
  }
  static currentWork;
  static async addTimeToCurrentWork(time) {
    if (time) {
      await this.currentWork.addTimeAndSave(time);
    } else {
      Flash.error("Work time too short to save.");
    }
  }
  static get obj() {
    return this._obj || (this._obj = DGet("section#current-work-container"));
  }
  static _obj;
  static async getCurrent() {
    const retour = await fetch(HOST + "task/current").then((r) => r.json());
    console.log("retour:", retour);
    prefs.setData(retour.prefs);
    Clock.setClockStyle(retour.prefs.clock);
    ui.setUITheme(retour.prefs.theme);
    if (retour.task.ok === false) {
      Flash.error("No active task. Set the task list.");
      return false;
    } else {
      this.displayWork(retour.task, retour.options);
      return true;
    }
  }
  static displayWork(wdata, options) {
    this.currentWork = new Work(wdata);
    this.currentWork.display(options);
  }
  constructor(data) {
    this.data = data;
  }
  get id() {
    return this.data.id;
  }
  async addTimeAndSave(time) {
    this.data.totalTime += time;
    this.data.cycleTime += time;
    this.data.restTime -= time;
    if (this.data.restTime < 0) {
      this.data.restTime = 0;
    }
    if (this.data.cycleCount === 0) {
      this.data.cycleCount = 1;
      this.data.startedAt = Clock.getStartTime();
    }
    this.data.lastWorkedAt = Clock.getStartTime();
    console.log("[addTimeAndSave] Enregistrement des temps");
    const result = await fetch(HOST + "work/save-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.data)
    }).then((r) => r.json());
    console.log("Retour save times: ", result);
    this.dispatchData();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Work.displayWork(result.next, result.options);
    if (result.ok) {
      Flash.success("New times saved.");
    }
    return true;
  }
  display(options) {
    this.dispatchData();
    ui.showButtons({
      Start: true,
      Stop: false,
      Pause: false,
      Change: options.canChange,
      runScript: !!this.data.startupScript,
      openFolder: !!this.data.folder
    });
  }
  dispatchData() {
    Object.entries(this.data).forEach(([k, v]) => {
      v = ((prop, v2) => {
        switch (prop) {
          case "totalTime":
          case "cycleTime":
          case "restTime":
            return Clock.time2horloge(v2);
          default:
            return v2;
        }
      })(k, v);
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
Work.init();

// public/ui.ts
function stopEvent2(ev) {
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
  setUITheme(theme) {
    document.body.className = theme;
  }
  hide(eList) {
    eList.forEach((e) => e.obj.classList.add("hidden"));
  }
  show(eList) {
    eList.forEach((e) => e.obj.classList.remove("hidden"));
  }
  mask(eList) {
    eList.forEach((e) => e.obj.classList.add("invisible"));
  }
  reveal(eList) {
    eList.forEach((e) => e.obj.classList.remove("invisible"));
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
    this.mask([this.btnStart]);
    this.reveal([this.btnStop, this.btnPause]);
    Clock.start();
  }
  onStop(ev) {
    this.mask([this.btnStop, this.btnPause]);
    this.reveal([this.btnStart]);
    const workTime = Clock.stop();
    Work.addTimeToCurrentWork(Math.round(workTime / 60));
  }
  onPause(ev) {
    this.mask([this.btnPause]);
    this.reveal([this.btnStart]);
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
      "Stop",
      "STOP",
      this.onStop.bind(this),
      true,
      1,
      "Pour arrêter la tâche et passer à la suivante (éviter…)"
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
    this.data.onclick();
    return stopEvent2(ev);
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
  ui,
  UI
};
