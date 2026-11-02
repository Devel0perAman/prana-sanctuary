// Optional email. Works only if `nodemailer` is installed AND SMTP_HOST is set.
// Otherwise everything is still saved to server/data/ so no enquiry is ever lost.
export async function createMailer(env) {
  if (!env.SMTP_HOST) return null
  try {
    const { default: nodemailer } = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: env.SMTP_HOST, port: Number(env.SMTP_PORT) || 587, secure: Number(env.SMTP_PORT) === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
    return {
      send: (msg) => transport.sendMail({ from: env.MAIL_FROM || env.SMTP_USER, ...msg }),
    }
  } catch (e) {
    console.warn('[mailer] SMTP_HOST is set but nodemailer is not installed — run `npm i nodemailer`. Emails disabled.')
    return null
  }
}
