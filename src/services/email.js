import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

const DESTINATARI = [
  'luca.nic1893@gmail.com',
  'piemonteseluca7@gmail.com',
];

export async function sendNotifica(segnalazione) {
  const { id, tipo, urgente, scuola, ausilio_nome, note, nome_funzionario, email_funzionario } = segnalazione;

  const urgenzaLabel = urgente ? 'URGENTE (24h)' : 'Normale (48h)';
  const ausilioInfo = ausilio_nome ? `<br><strong>Ausilio:</strong> ${ausilio_nome}` : '';
  const noteInfo = note ? `<br><strong>Note:</strong> ${note}` : '';

  const html = `
    <h2>Nuova segnalazione #${id}</h2>
    <p><strong>Priorita:</strong> ${urgenzaLabel}</p>
    <p><strong>Tipo intervento:</strong> ${tipo}</p>
    <p><strong>Scuola:</strong> ${scuola}${ausilioInfo}${noteInfo}</p>
    <hr>
    <p><strong>Inviata da:</strong> ${nome_funzionario} (${email_funzionario})</p>
    <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
  `;

  const result = await resend.emails.send({
    from: 'Piattaforma Ausili <onboarding@resend.dev>',
    to: DESTINATARI,
    reply_to: email_funzionario,
    subject: `[${urgente ? 'URGENTE' : 'Nuova'}] Segnalazione #${id} - ${tipo} - ${scuola}`,
    html,
  });

  console.log('Email inviata:', JSON.stringify(result));
}
