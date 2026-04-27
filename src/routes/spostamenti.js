import { Router } from 'express';
import { db } from '../db/connection.js';

const router = Router();

// GET storico completo spostamenti
router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT s.*, a.nome AS ausilio_nome, a.inv_id
    FROM spostamenti s
    JOIN ausili a ON s.ausilio_id = a.id
    ORDER BY s.data DESC
    LIMIT 200
  `).all();
  res.json(rows);
});

export default router;
