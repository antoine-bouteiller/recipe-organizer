import { getBindings } from '@/lib/bindings'
import { Resend } from 'resend'

const resend = new Resend(getBindings().RESEND_API_KEY)

const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await resend.emails.send({
    from: 'no-reply@antoinebouteiller.fr',
    to,
    subject,
    html,
  })

  console.log('sendEmail', response.error, response.data)
}

const formatEmail = (html: string, args: Record<string, string>) => {
  for (const [key, value] of Object.entries(args)) {
    html = html.replaceAll(`\${${key}}`, value)
  }
  return html
}

export { sendEmail, formatEmail }
