# Piattaforma Inventario + Segnalazioni

## Contesto
Piattaforma collegata a un sito web statico (HTML/CSS/JS) esistente.
Serve per gestire un inventario di oggetti e ricevere segnalazioni/reclami dagli utenti.

## Stack
- Backend: Node.js + Express (ESM), SQLite (better-sqlite3)
- Frontend admin: HTML/CSS/JS vanilla
- DB: file SQLite in ./data/platform.db

## Struttura
- src/routes/       -> endpoint REST
- src/controllers/  -> logica business
- src/services/     -> servizi condivisi (email, auth, ecc.)
- src/db/           -> connessione e schema DB
- public/           -> pannello admin e asset statici

## Modello dati
- inventory: oggetti dell'inventario (name, description, category, quantity, status, image_url)
- segnalazioni: reclami degli utenti (item_id, user_name, user_email, reason, notes, status)

## Endpoint principali
- GET/POST/PUT/DELETE /api/inventory
- GET/POST /api/segnalazioni
- PUT /api/segnalazioni/:id/status

## Cose da fare
- Autenticazione admin (JWT)
- Upload immagini per inventario
- Notifiche email su nuova segnalazione
- Integrazione col sito principale (form pubblico per segnalazioni)
