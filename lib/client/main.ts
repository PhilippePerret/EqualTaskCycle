import log from 'electron-log/renderer';
import { loc } from '../shared/Locale';
import { prefs } from './prefs';
import { Work } from './work';
import { ui } from './ui';

class Client { /* singleton */

  public async init(){
    log.info("=== INITIALISATION CLIENT ===");
    log.info('Prefs init…');
    await prefs.init();
    log.info('  -- ok');
    log.info('UI init…');
    ui.init(prefs.getSavedData());
    log.info('  -- ok');
    log.info('Locales init…');
    await loc.init(prefs.getLang()); 
    log.info('  -- ok');
    log.info('Work init…');
    await Work.init();
    log.info('  -- ok');
    log.info("JE DOIS POURSUIVRE L'INITIALISATION");
  }

  private static inst: Client;
  private constructor(){}
  public static getInst(){return this.inst || (this.inst = new Client())}
}

const client = Client.getInst();
client.init();