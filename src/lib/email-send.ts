import { env } from 'cloudflare:workers'
import { Resend } from 'resend'

const resend = new Resend(env.RESEND_API_KEY)

const sendEmail = async (to: string, subject: string, html: string) => {
  await resend.emails.send({
    from: 'no-reply@antoinebouteiller.fr',
    to,
    subject,
    html,
  })
}

const formatEmail = (html: string, args: Record<string, string>) => {
  for (const [key, value] of Object.entries(args)) {
    html = html.replaceAll(`\${${key}}`, value)
  }
  return html
}

export { sendEmail, formatEmail }
