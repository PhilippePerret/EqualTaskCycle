import { DGet } from "./dom"

/**
 * Quatre types de message :
 * 
 *  - info/notice
 *  - success
 *  - warning (alerte)
 *  - error
 * 
 * Usage
 * -----
 *  
 *  Flash.notice("L'application est prête")
 * 
 */
export class Flash {
  static init(){
    // console.info("Initialisation de Flash")
  }

  /**
   * Fonction qui, au chargement de la page, vérifie si un message
   * produit par le serveur est présent, et le temporise.
   */
  static checkServerMessages(){
    const divMsg = DGet("div#flash-group div#flash-info")
    if ( divMsg ){
      const content = DGet('p.message', divMsg).innerHTML
      DGet('button', divMsg).remove() // on retire le bouton pour ferme le message
      this.temporize(divMsg, this.calcReadingTime(content))
    }
  }
  static temporize(domMessage, readingTime){
    this.timer = setTimeout(this.removeServerMessage.bind(this, domMessage), 2000 + readingTime)
  }
  static removeServerMessage(domE, ev){
    // console.info("domE", domE)
    domE.remove()
    this.timer && clearTimeout(this.timer);
    delete this.timer
  }

  static calcReadingTime(str){
    return str.split(" ").length * 300 * 4
  }

  static notice(message, options) {
    this.buildMessage({content: message, type: 'notice', options})
  }
  static info(message, options){return this.notice(message, options)}

  static success(message, options){
    this.buildMessage({content: message, type: 'success', options})
  }
  static warning(message, options) {
    this.buildMessage({content: message, type: 'warning', options})
  }
  static error(message, options) {
    this.buildMessage({content: message, type: 'error', options})
  }

  static buildMessage(data){
    new FlashMessage(data)
  }

  /**
   * Pour détruire un message affiché
   */
  static removeMessage(message){
    if (message.timer) {
      clearTimeout(message.timer);
      message.timer = null
    }
    message.obj.remove()
    message = undefined
  }

  static get conteneur(){
    return this._maincont || (this._maincont = DGet("#flash-group"))
  }
}

class FlashMessage {
  constructor(data){
    // console.log("data", data)
    this.data = data
    this.options = data.options || {};
    this.build()
    this.show()
    this.options.keep === true || this.temporize();
    this.observe()
  }

  build(){
    const msg = document.createElement('DIV')
    msg.className = `flash-message ${this.type}`
    msg.innerHTML = this.content
    this.obj = msg
  }

  show(){
    Flash.conteneur.appendChild(this.obj)
  }

  observe(){
    this.obj.addEventListener('click', this.onClick.bind(this))
  }

  onClick(ev){
    Flash.removeMessage(this)
  }

  temporize(){
    this.timer = setTimeout(Flash.removeMessage.bind(Flash, this), 2000 + this.readingTime)
  }

  get readingTime(){
    return Flash.calcReadingTime(this.content)
  }

  get content(){return this.data.content}
  get type(){return this.data.type}
}