import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const sendNotificationEmail = async (
  payload: any,
  {
    formTitle,
    recipientEmail,
    pageTitle,
    values,
  }: {
    formTitle: string
    recipientEmail?: string
    pageTitle?: string
    values: Record<string, any>
  },
) => {
  const to = recipientEmail || process.env.SMTP_FROM || ''
  if (!to) return

  const rows = Object.entries(values)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">${key}</td><td style="padding:6px 12px">${Array.isArray(value) ? value.join(', ') : value}</td></tr>`,
    )
    .join('')

  await payload.sendEmail({
    to,
    subject: `New enquiry: ${formTitle}${pageTitle ? ` (${pageTitle})` : ''}`,
    html: `<table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">${rows}</table>`,
    text: Object.entries(values)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join('\n'),
  })
}

const getRequestIp = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim()
  return request.headers.get('cf-connecting-ip')?.trim() || undefined
}

const validateTurnstile = async ({ token, remoteip }: { token?: string; remoteip?: string }) => {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { enabled: false, success: true }
  if (!token) return { enabled: true, success: false }

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteip) body.set('remoteip', remoteip)

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) return { enabled: true, success: false }
  const result = (await response.json()) as { success?: boolean }
  return { enabled: true, success: Boolean(result.success) }
}

const schema = z.object({
  formTitle: z.string().min(1),
  pageTitle: z.string().optional(),
  pageSlug: z.string().optional(),
  recipientEmail: z.string().email().optional().or(z.literal('')),
  turnstileToken: z.string().optional(),
  values: z.record(z.string(), z.any()),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  referrer: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.parse(body)
    const ipAddress = getRequestIp(request)
    const turnstile = await validateTurnstile({ token: parsed.turnstileToken, remoteip: ipAddress })

    if (turnstile.enabled && !turnstile.success) {
      return NextResponse.json(
        { ok: false, message: 'Robot verification failed. Please try again.' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const payloadAny = payload as any

    await payloadAny.create({
      collection: 'contact-submissions',
      overrideAccess: true,
      data: {
        formTitle: parsed.formTitle,
        pageTitle: parsed.pageTitle,
        pageSlug: parsed.pageSlug,
        recipientEmail: parsed.recipientEmail,
        submissionData: parsed.values,
        utmSource: parsed.utmSource,
        utmMedium: parsed.utmMedium,
        utmCampaign: parsed.utmCampaign,
        utmContent: parsed.utmContent,
        utmTerm: parsed.utmTerm,
        referrer: parsed.referrer,
      },
    })

    await sendNotificationEmail(payload, {
      formTitle: parsed.formTitle,
      recipientEmail: parsed.recipientEmail,
      pageTitle: parsed.pageTitle,
      values: parsed.values,
    }).catch((err) => console.error('Email notification failed:', err))

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
