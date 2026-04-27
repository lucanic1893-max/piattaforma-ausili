import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import ausilioRoutes from './routes/ausili.js';
import segnalazioniRoutes from './routes/segnalazioni.js';
import spostamentiRoutes from './routes/spostamenti.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/ausili', ausilioRoutes);
app.use('/api/segnalazioni', segnalazioniRoutes);
app.use('/api/spostamenti', spostamentiRoutes);

app.listen(PORT, () => {
  console.log('Piattaforma Ausili Genova attiva su http://localhost:' + PORT);
  console.log('Admin panel: http://localhost:' + PORT + '/pages/admin.html');
  console.log('Segnalazioni: http://localhost:' + PORT + '/pages/segnala.html');
});
