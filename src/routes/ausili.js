import { Router } from 'express';
import { db } from '../db/connection.js';

const router = Router();

// GET tutti gli ausili
router.get('/', (req, res) => {
  const { posizione } = req.query;
  let query = 'SELECT * FROM ausili';
  const params = [];
  if (posizione) {
    query += ' WHERE posizione_attuale = ?';
    params.push(posizione);
  }
  query += ' ORDER BY inv_id ASC';
  const items = db.prepare(query).all(...params);
  res.json(items);
});

// GET ausili per scuola
router.get('/per-scuola/:scuola', (req, res) => {
  const items = db.prepare(
    'SELECT * FROM ausili WHERE posizione_attuale = ? ORDER BY nome ASC'
  ).all(req.params.scuola);
  res.json(items);
});

// GET singolo ausilio con storico spostamenti
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM ausili WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Non trovato' });
  const spostamenti = db.prepare(
    'SELECT * FROM spostamenti WHERE ausilio_id = ? ORDER BY data DESC'
  ).all(req.params.id);
  res.json({ ...item, spostamenti });
});

// POST sposta ausilio
router.post('/:id/sposta', (req, res) => {
  const { nuova_posizione, note } = req.body;
  if (!nuova_posizione) return res.status(400).json({ error: 'Destinazione obbligatoria' });

  const ausilio = db.prepare('SELECT * FROM ausili WHERE id = ?').get(req.params.id);
  if (!ausilio) return res.status(404).json({ error: 'Ausilio non trovato' });

  const da = ausilio.posizione_attuale;
  const tipo = nuova_posizione === 'magazzino' ? 'magazzino' : 'scuola';

  db.prepare(
    'UPDATE ausili SET posizione_attuale = ?, posizione_tipo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(nuova_posizione, tipo, req.params.id);

  db.prepare(
    'INSERT INTO spostamenti (ausilio_id, da, a, note) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, da, nuova_posizione, note || null);

  res.json({ ok: true, da, a: nuova_posizione });
});

// GET scuole disponibili
router.get('/meta/scuole', (req, res) => {
  const scuole = db.prepare('SELECT * FROM scuole ORDER BY nome ASC').all();
  res.json(scuole);
});

export default router;
