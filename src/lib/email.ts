import type { EmailAdapter, SendEmailOptions } from 'payload'

const API_URL = 'https://api.smtp2go.com/v3/email/send'

export const smtp2goAdapter: EmailAdapter = () => ({
  name: 'smtp2go',
  defaultFromAddress: process.env.SMTP_FROM || '',
  defaultFromName: process.env.SMTP_FROM_NAME || '',
  sendEmail: async (message: SendEmailOptions) => {
    const to = Array.isArray(message.to) ? message.to : [message.to]
    const sender = message.from
      || `${process.env.SMTP_FROM_NAME || ''} <${process.env.SMTP_FROM || ''}>`

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.SMTP_API_KEY,
        sender,
        to,
        subject: message.subject,
        html_body: message.html,
        text_body: message.text,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`SMTP2GO: ${JSON.stringify(err)}`)
    }

    return res.json()
  },
})
