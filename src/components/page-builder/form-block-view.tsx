'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: Record<string, unknown>,
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
    gtag?: (...args: unknown[]) => void
  }
}

type UtmParams = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
}

type FormField = {
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  type?: string
  width?: string
  options?: { label?: string; value?: string }[]
}

export const FormBlockView = ({
  formTitle,
  formDescription,
  fields,
  showFieldLabels,
  submitButtonText,
  privacyNote,
  successMessage,
  recipientEmail,
  pageTitle,
  pageSlug,
  dark,
}: {
  formTitle?: string
  formDescription?: string
  fields: FormField[]
  showFieldLabels?: boolean
  submitButtonText?: string
  privacyNote?: string
  successMessage?: string
  recipientEmail?: string
  pageTitle?: string
  pageSlug?: string
  dark?: boolean
}) => {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileEnabled = Boolean(turnstileSiteKey)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const initialState = Object.fromEntries(fields.map((field) => [field.name || '', field.type === 'checkbox' ? [] : '']))
  const [formState, setFormState] = useState<Record<string, any>>(initialState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('Something went wrong. Please try again.')
  const utmRef = useRef<UtmParams>({})

  useEffect(() => {
    if (!turnstileEnabled || !turnstileReady || !turnstileContainerRef.current || turnstileWidgetId || !window.turnstile) {
      return
    }

    const widgetId = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      theme: dark ? 'dark' : 'light',
      size: 'flexible',
      callback: (token: string) => {
        setTurnstileToken(token)
        setErrorMessage('Something went wrong. Please try again.')
      },
      'expired-callback': () => {
        setTurnstileToken('')
      },
      'error-callback': () => {
        setTurnstileToken('')
      },
    })

    setTurnstileWidgetId(widgetId)

    return () => {
      if (window.turnstile && widgetId) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [dark, turnstileEnabled, turnstileReady, turnstileSiteKey, turnstileWidgetId])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    utmRef.current = {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      utmTerm: params.get('utm_term') ?? undefined,
      referrer: document.referrer || undefined,
    }
  }, [])

  const updateValue = (name: string, value: unknown) => {
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('Something went wrong. Please try again.')

    if (turnstileEnabled && !turnstileToken) {
      setStatus('error')
      setErrorMessage('Please complete the robot check before sending your message.')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formTitle,
          pageTitle,
          pageSlug,
          recipientEmail,
          values: formState,
          turnstileToken: turnstileToken || undefined,
          ...utmRef.current,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        if (payload?.message && typeof payload.message === 'string') {
          setErrorMessage(payload.message)
        }
        throw new Error('Request failed')
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          form_name: formTitle,
          page_slug: pageSlug,
        })
      }

      setStatus('success')
      setFormState(initialState)
      setTurnstileToken('')
      if (window.turnstile && turnstileWidgetId) {
        window.turnstile.reset(turnstileWidgetId)
      }
    } catch {
      setStatus('error')
      setTurnstileToken('')
      if (window.turnstile && turnstileWidgetId) {
        window.turnstile.reset(turnstileWidgetId)
      }
    }
  }

  return (
    <>
      {turnstileEnabled ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}
      <form onSubmit={onSubmit} className={`rounded-[30px] border p-8 ${dark ? 'border-white/10 bg-white/8 backdrop-blur' : 'border-brand-dark/10 bg-white shadow-panel'}`}>
        {formTitle ? <h3 className={`font-heading text-2xl font-semibold ${dark ? 'text-white' : 'text-brand-dark'}`}>{formTitle}</h3> : null}
        {formDescription ? <p className={`mt-3 text-base leading-7 ${dark ? 'text-white/72' : 'text-brand-gunmetal/78'}`}>{formDescription}</p> : null}
        <div className="mt-6 grid items-start gap-5 md:grid-cols-2">
          {fields.map((field, index) => {
            const key = field.name || `field-${index}`
            const fullWidth = field.type === 'textarea' || field.type === 'checkbox' || field.width !== 'half'
            const wrapperClassName = `min-w-0 flex flex-col gap-2 ${fullWidth ? 'md:col-span-2' : ''}`
            const labelClassName = showFieldLabels === false ? 'sr-only' : `text-sm font-medium ${dark ? 'text-white' : 'text-brand-dark'}`
            const sharedClassName = `block w-full min-w-0 box-border appearance-none rounded-[14px] border px-4 py-3 shadow-none outline-none transition focus:ring-2 focus:ring-brand-blue/10 ${dark ? 'border-white/15 bg-brand-dark/40 text-white placeholder:text-white/45 focus:border-brand-blue' : 'border-slate-200 bg-white text-brand-dark placeholder:text-brand-gunmetal/45 focus:border-brand-blue'}`

            if (field.type === 'textarea') {
              return (
                <label key={key} className={wrapperClassName}>
                  <span className={labelClassName}>{field.label}</span>
                  <textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    rows={5}
                    value={formState[key] || ''}
                    onChange={(event) => updateValue(key, event.target.value)}
                    className={`${sharedClassName} resize-none`}
                  />
                </label>
              )
            }

            if (field.type === 'select') {
              return (
                <label key={key} className={wrapperClassName}>
                  <span className={labelClassName}>{field.label}</span>
                  <select
                    required={field.required}
                    value={formState[key] || ''}
                    onChange={(event) => updateValue(key, event.target.value)}
                    className={sharedClassName}
                  >
                    <option value="">{field.placeholder || 'Select an option'}</option>
                    {(field.options || []).map((option, optionIndex) => (
                      <option key={`${key}-${optionIndex}`} value={option.value || ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }

            if (field.type === 'checkbox') {
              return (
                <fieldset key={key} className={wrapperClassName}>
                  <legend className={labelClassName}>{field.label}</legend>
                  {(field.options || []).map((option, optionIndex) => {
                    const selected = Array.isArray(formState[key]) ? formState[key] : []

                    return (
                      <label key={`${key}-${optionIndex}`} className={`flex items-center gap-3 text-sm ${dark ? 'text-white/80' : 'text-brand-gunmetal'}`}>
                        <input
                          type="checkbox"
                          checked={selected.includes(option.value || '')}
                          onChange={(event) => {
                            if (event.target.checked) {
                              updateValue(key, [...selected, option.value || ''])
                              return
                            }

                            updateValue(
                              key,
                              selected.filter((value: string) => value !== (option.value || '')),
                            )
                          }}
                        />
                        <span>{option.label}</span>
                      </label>
                    )
                  })}
                </fieldset>
              )
            }

            return (
              <label key={key} className={wrapperClassName}>
                <span className={labelClassName}>{field.label}</span>
                <input
                  required={field.required}
                  type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                  placeholder={field.placeholder}
                  value={formState[key] || ''}
                  onChange={(event) => updateValue(key, event.target.value)}
                  className={sharedClassName}
                />
              </label>
            )
          })}
        </div>
        {turnstileEnabled ? (
          <div className="mt-6">
            <div ref={turnstileContainerRef} />
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-2 rounded-[14px] bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              {status === 'submitting' ? 'Sending...' : submitButtonText || 'Send'}
              {status === 'submitting' ? null : <ArrowRight size={16} />}
            </button>
            {status === 'success' ? <p className="text-sm text-emerald-600">{successMessage || 'Thanks for your enquiry.'}</p> : null}
            {status === 'error' ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          </div>
          {privacyNote ? (
            <p className={`flex items-center gap-2 text-sm ${dark ? 'text-white/70' : 'text-brand-gunmetal/68'}`}>
              <LockKeyhole size={16} />
              <span>{privacyNote}</span>
            </p>
          ) : null}
        </div>
      </form>
    </>
  )
}
