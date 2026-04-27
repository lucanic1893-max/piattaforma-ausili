import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotifica(segnalazione) {
  const { id, tipo, urgente, scuola, ausilio_nome, note, nome_funzionario, email_funzionario } = segnalazione;
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'luca.nic1893@gmail.com',
      subject: `[${urgente ? 'URGENTE' : 'Nuova'}] Segnalazione #${id} - ${tipo} - ${scuola}`,
      html: `<h2>Segnalazione #${id}</h2>
        <p><b>Priorita:</b> ${urgente ? 'URGENTE (24h)' : 'Normale (48h)'}</p>
        <p><b>Tipo:</b> ${tipo}</p>
        <p><b>Scuola:</b> ${scuola}</p>
        <p><b>Ausilio:</b> ${ausilio_nome || 'non specificato'}</p>
        <p><b>Note:</b> ${note || 'nessuna'}</p>
        <p><b>Da:</b> ${nome_funzionario} (${email_funzionario})</p>`,
    });
    console.log('Email inviata OK');
  } catch(err) {
    console.error('Errore email:', err.message);
  }
}
