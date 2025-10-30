import express from 'express';
import log from 'electron-log/main';
import { setupRoutes } from './routes';
import { HOST, PORT } from '../../public/js/constants';

const app = express();

// --- middleware ---
// app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('public'));

// --- Définition des routes ---
setupRoutes(app);

app.listen(PORT, () => {
  log.info(`Server running on ${HOST}`);
});
