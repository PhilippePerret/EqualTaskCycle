// public/js/constants.js
var PORT = 3002;
var HOST = `http://localhost:${PORT}/`;

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

// public/js/ui.js
function DGet2(selector, container) {
  if (container === undefined) {
    container = document.body;
  }
  return container.querySelector(selector);
}
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
  showButtons(states) {
    this.buttons.forEach((bouton) => bouton.setState(states[bouton.id]));
  }
  closeSectionWork() {
    DGet2("section#work").classList.add("hidden");
  }
  openSectionWork() {
    DGet2("section#work").classList.remove("hidden");
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

// public/ui.ts
function stopEvent3(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}

class UI2 {
  static instance;
  constructor() {}
  static getInstance() {
    return UI2.instance || (UI2.instance = new UI2);
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
      this[`btn${id}`] = new Button2({ id, name, onclick, hidden, row, title }).build();
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

class Button2 {
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
    return stopEvent3(ev);
  }
  build() {
    const o = document.createElement("BUTTON");
    o.innerHTML = this.data.name;
    o.id = `btn-${this.id}`;
    o.setAttribute("title", this.data.title);
    o.addEventListener("click", this.onClick.bind(this));
    Button2.container.querySelector(`div#row${this.data.row}`).appendChild(o);
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
var ui2 = UI2.getInstance();

// public/prefs.ts
class Prefs {
  data;
  static instance;
  constructor() {}
  static getInstance() {
    return this.instance || (this.instance = new Prefs);
  }
  init() {
    DGet("button.btn-prefs").addEventListener("click", this.onOpen.bind(this));
    DGet("button.btn-close-prefs").addEventListener("click", this.onClose.bind(this));
    DGet("button.btn-save-prefs").addEventListener("click", this.onSave.bind(this));
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
  onOpen(ev) {
    this.open();
    return stopEvent(ev);
  }
  onClose(ev) {
    this.close();
    return stopEvent(ev);
  }
  setData(data) {
    console.log("Data prefs", data);
    this.data = data;
    Object.entries(this.data).forEach(([k, v]) => {
      switch (k) {
        case "random":
          this.field(k).checked = v;
          break;
        default:
          this.field(k).value = v;
      }
    });
  }
  getData() {
    Object.entries(this.data).forEach(([k, v]) => {
      switch (k) {
        case "random":
          Object.assign(this.data, { [k]: this.field(k).checked });
          break;
        default:
          Object.assign(this.data, { [k]: this.field(k).value });
      }
    });
    return this.data;
  }
  field(key) {
    return DGet(`#prefs-${key}`, this.section) || console.error("Le champ 'prefs-%s' est introuvable", key);
  }
  close() {
    ui2.openSectionWork();
    this.section.classList.add("hidden");
  }
  open() {
    this.section.classList.remove("hidden");
    ui2.closeSectionWork();
  }
  get section() {
    return DGet("section#preferences");
  }
}
var prefs = Prefs.getInstance();

// public/client.ts
class Work {
  data;
  static init() {
    Work.getCurrent();
    prefs.init();
    Flash.notice("L'application est prête.");
  }
  static currentWork;
  static get obj() {
    return this._obj || (this._obj = DGet("section#current-work-container"));
  }
  static _obj;
  static async getCurrent() {
    const retour = await fetch(HOST + "task/current").then((r) => r.json());
    const dataCurrentWork = retour.task;
    this.currentWork = new Work(dataCurrentWork);
    this.currentWork.display(retour.options);
    prefs.setData(retour.prefs);
  }
  constructor(data) {
    this.data = data;
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
Work.init();
