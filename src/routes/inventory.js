import { Router } from 'express';
import { db } from '../db/connection.js';

const router = Router();

// GET tutti gli oggetti
router.get('/', (req, res) => {
  const items = db.prepare('SELECT * FROM inventory ORDER BY created_at DESC').all();
  res.json(items);
});

// GET singolo oggetto
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM inventory WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Non trovato' });
  res.json(item);
});

// POST nuovo oggetto
router.post('/', (req, res) => {
  const { name, description, category, quantity, image_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Il nome e obbligatorio' });
  const result = db.prepare(
    'INSERT INTO inventory (name, description, category, quantity, image_url) VALUES (?, ?, ?, ?, ?)'
  ).run(name, description, category, quantity || 1, image_url);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT aggiorna oggetto
router.put('/:id', (req, res) => {
  const { name, description, category, quantity, status, image_url } = req.body;
  db.prepare(
    'UPDATE inventory SET name=?, description=?, category=?, quantity=?, status=?, image_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(name, description, category, quantity, status, image_url, req.params.id);
  res.json({ ok: true });
});

// DELETE oggetto
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM inventory WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
