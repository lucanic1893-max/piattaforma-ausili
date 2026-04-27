import { Router } from 'express';
import { db } from '../db/connection.js';
import { sendNotifica } from '../services/email.js';

const router = Router();

const TIPI_INTERVENTO = [
  'Manutenzione straordinaria',
  'Manutenzione ordinaria',
  'Trasporto / Spostamento',
  'Pulizia e disinfezione',
  'Consulenza tecnica',
  'Rottamazione',
];

// GET tutte le segnalazioni
router.get('/', (req, res) => {
  const { stato } = req.query;
  let query = 'SELECT * FROM segnalazioni';
  const params = [];
  if (stato) {
    query += ' WHERE stato = ?';
    params.push(stato);
  }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
});

// GET tipi intervento disponibili
router.get('/tipi', (req, res) => {
  res.json(TIPI_INTERVENTO);
});

// POST nuova segnalazione (dal funzionario del Comune)
router.post('/', async (req, res) => {
  const { tipo, urgente, scuola, ausilio_id, ausilio_nome, note, email_funzionario, nome_funzionario } = req.body;

  if (!tipo || !scuola || !email_funzionario || !nome_funzionario) {
    return res.status(400).json({ error: 'Tipo, scuola, nome e email sono obbligatori' });
  }

  if (!TIPI_INTERVENTO.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo intervento non valido' });
  }

  const result = db.prepare(`
    INSERT INTO segnalazioni (tipo, urgente, scuola, ausilio_id, ausilio_nome, note, email_funzionario, nome_funzionario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tipo, urgente ? 1 : 0, scuola, ausilio_id || null, ausilio_nome || null, note || null, email_funzionario, nome_funzionario);

  // Invia notifica email
  try {
    await sendNotifica({
      id: result.lastInsertRowid,
      tipo,
      urgente,
      scuola,
      ausilio_nome,
      note,
      nome_funzionario,
      email_funzionario,
    });
  } catch (err) {
    console.error('Errore invio email:', err.message);
  }

  res.status(201).json({ id: result.lastInsertRowid, ok: true });
});

// PUT aggiorna stato segnalazione
router.put('/:id/stato', (req, res) => {
  const { stato } = req.body;
  const stati = ['in_attesa', 'in_corso', 'chiusa'];
  if (!stati.includes(stato)) return res.status(400).json({ error: 'Stato non valido' });

  const chiusura = stato === 'chiusa' ? new Date().toISOString() : null;
  db.prepare(
    'UPDATE segnalazioni SET stato = ?, data_chiusura = ? WHERE id = ?'
  ).run(stato, chiusura, req.params.id);

  res.json({ ok: true });
});

export default router;
