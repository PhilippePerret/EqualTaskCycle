import log from 'electron-log/renderer';

class Client { /* singleton */

  public init(){
    log.info("=== INITIALISATION CLIENT ===");
    log.warn("Je dois apprendre à initialiser l'application.");
  }

  private static inst: Client;
  private constructor(){}
  public static getInst(){return this.inst || (this.inst = new Client())}
}

const client = Client.getInst();
client.init();