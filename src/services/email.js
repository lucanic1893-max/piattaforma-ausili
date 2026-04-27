import nodemailer from 'nodemailer';
import 'dotenv/config';

const DESTINATARI = [
  'luca.nic1893@gmail.com',
  'piemonteseluca7@gmail.com',
];

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNotifica(segnalazione) {
  const { id, tipo, urgente, scuola, ausilio_nome, note, nome_funzionario, email_funzionario } = segnalazione;

  const urgenzaLabel = urgente ? '🔴 URGENTE (24h)' : '🟡 Normale (48h)';
  const ausilioInfo = ausilio_nome ? `\nAusilio: ${ausilio_nome}` : '';
  const noteInfo = note ? `\nNote: ${note}` : '';

  const testo = `
Nuova segnalazione ricevuta — ID #${id}

Priorità: ${urgenzaLabel}
Tipo intervento: ${tipo}
Scuola: ${scuola}${ausilioInfo}${noteInfo}

Inviata da: ${nome_funzionario} (${email_funzionario})
Data: ${new Date().toLocaleString('it-IT')}

---
Gestisci la segnalazione dal pannello admin:
http://localhost:3000/pages/admin.html
  `.trim();

  await transporter.sendMail({
    from: `"Piattaforma Ausili Genova" <${process.env.EMAIL_USER}>`,
    to: DESTINATARI.join(', '),
    replyTo: email_funzionario,
    subject: `[${urgente ? 'URGENTE' : 'Nuova'}] Segnalazione #${id} — ${tipo} — ${scuola}`,
    text: testo,
  });

  console.log('Email inviata a:', DESTINATARI.join(', '));
}
