import log from 'electron-log/renderer';
import { loc, t } from '../shared/Locale';
import { prefs } from './prefs';
import { Work } from './work';
import { ui } from './ui';
import { Flash } from '../../public/js/flash';
import { DGet } from '../../public/js/dom';
import { help } from './help';
import { editor } from './editing';

class Client { /* singleton */

  private initObjetSync(objet: any){}


  public async init(){
    log.info("=== INITIALISATION CLIENT ===");
    log.info('Prefs init…');
    await prefs.init();
    log.info('  -- ok');
    log.info('Locales init…');
    if (await loc.init(prefs.getLang())) { log.info('  -- ok') }
    else { log.info('Un problème est servenu avec les locales…') }
    log.info('UI init…');
    ui.init(prefs.getSavedData());
    log.info('  -- ok');
    log.info('Work init…');
    if (await Work.init()) {log.info('  -- ok')}
    else { log.info('Problem avec Work.init') }
    log.info('Editor init…');
    if (editor.init()) { log.info('  --ok')}
    else { log.info('Problem with Editor init') }
    log.info('Help init…');
    if (help.init()) { log.info('  -- ok')}
    else {log.info('Problem with help.init')}

    Flash.notice(`${t('app.is_ready')} <span id="mes123">(${t('help.show')})</span>`)
    DGet('span#mes123').addEventListener('click', 
      help.show.bind(help, ['resume_home_page']),
      {once: true, capture: true}
    )
  }

  private static inst: Client;
  private constructor(){}
  public static getInst(){return this.inst || (this.inst = new Client())}
}

const client = Client.getInst();
client.init();