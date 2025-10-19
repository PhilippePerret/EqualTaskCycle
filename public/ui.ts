function stopEvent(ev: Event){
  ev.stopPropagation();
  ev.preventDefault();
  return false
}
interface ButtonType {
  id: string;
  name: string;
  onclick: Function;
  hidden: boolean;
  row: 1 | 2;
  title: string; // aide au survol
}



class UI {
  private static instance: UI;
  private constructor(){}
  public static getInstance(){
    return UI.instance || (UI.instance = new UI());
  }

  public showButtons(states: {[x: string]: boolean}):void {
    this.buttons.forEach((bouton: Button) => bouton.setState(states[bouton.id] as boolean));
  };

  private onStart(ev: Event){}
  private onStop(ev: Event){}
  private onPause(ev: Event){}
  private onChange(ev: Event){}
  private onRunScript(ev: Event){}
  private onOpenFolder(ev: Event){}
  
  private btnStart?: Button;
  private btnPause?: Button;
  private btnStop?: Button;
  private btnChange?: Button;
  private btnRunScript?: Button;
  private btnOpenFolder?: Button;


  private get buttons(){
    this._buttons || this.instancieButtons();
    return this._buttons;
  }; private _buttons!: Button[];

  private instancieButtons(){
    this._buttons = this.DATA_BUTTONS.map((bdata: any[]) => {
      let id: string, name: string, onclick: Function, hidden: boolean, row: 1 | 2, title: string;
      [id, name, onclick, hidden, row, title] = bdata;
      (this as any)[`btn${id}`] = new Button({id, name, onclick, hidden, row, title}).build();
      return (this as any)[`btn${id}`];
    });
  } 
  DATA_BUTTONS: [string, string, Function, boolean, 1 | 2, string][] = [
    ['runScript', 'RUN SCRIPT', this.onRunScript.bind(this), false, 2,
      "Pour lancer le script défini au démarrage"],
    ['openFolder', 'OPEN FOLDER', this.onOpenFolder.bind(this), false, 2,
      "Pour ouvrir le dossier défini dans les données"],
    ['Change', 'CHANGE', this.onChange.bind(this), false, 2,
      "Pour changer de tâche (mais attention : une seule fois par session !"],
    ['Pause', 'PAUSE', this.onPause.bind(this), false, 1,
      "Pour mettre le travail en pause."],
    ['Stop', 'STOP', this.onStop.bind(this), true, 1, 
      "Pour arrêter la tâche et passer à la suivante (éviter…)"],
    ['Start', 'START', this.onStart.bind(this), false, 1,
      "Pour démarrer le travail sur cette tâche."],
  ];
}

class Button {

  public static get container(): HTMLDivElement{
    return this._container || ( this._container = document.body.querySelector('div#buttons-container') as HTMLDivElement)
  }; private static _container: HTMLDivElement;

  private _obj!: HTMLButtonElement;

  constructor(
    private data: ButtonType
  ){}

  public setState(state: boolean){
    this[state ? 'show' : 'hide']();
  }

  onClick(ev: MouseEvent){
    return stopEvent(ev);
  }

  build(){
    const o: HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    o.innerHTML = this.data.name;
    o.id = `btn-${this.id}`;
    o.setAttribute('title', this.data.title)
    o.addEventListener('click', this.onClick.bind(this));
    (Button.container.querySelector(`div#row${this.data.row}`) as HTMLDivElement).appendChild(o);
    this._obj = o;
    // Réglage du bouton
    if (this.data.hidden) { this.hide(); }
    else {this.show(); }
    return this;  // chainage
  }
  show(){
    this.obj.classList.remove('invisible');
  }
  hide(){
    this.obj.classList.add('invisible');
  }

  public get id(){ return this.data.id; }
  private get obj(){return this._obj;}
}




export const ui = UI.getInstance();