import Link from 'next/link'

import type { MediaDocument, SiteSettingsDocument } from '@/lib/types'

type NavigationItem = { label?: string; slug?: string }

// Brand assets must use the original upload. `mediaToUrl` intentionally prefers
// Payload's landscape Open Graph rendition, which crops a tall logo lockup.
const originalMediaUrl = (media?: MediaDocument | string | null) =>
  typeof media === 'string' ? media : media?.url

const hrefFor = (slug?: string) => {
  if (!slug || slug === 'home' || slug === '/') return '/'
  if (/^https?:\/\//.test(slug) || slug.startsWith('#')) return slug
  return `/${slug.replace(/^\/+/, '')}`
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

const NavLinks = ({
  items,
  className,
  label,
}: {
  items?: NavigationItem[]
  className: string
  label: string
}) => (
  <nav className={className} aria-label={label}>
    {items?.map((item, index) => {
      if (!item.label || !item.slug) return null
      const href = hrefFor(item.slug)
      return isExternal(href) ? (
        <a key={`${item.label}-${index}`} href={href} target="_blank" rel="noreferrer">
          {item.label}
        </a>
      ) : (
        <Link key={`${item.label}-${index}`} href={href}>
          {item.label}
        </Link>
      )
    })}
  </nav>
)

export function SiteHeader({ settings }: { settings: SiteSettingsDocument | null }) {
  const logoUrl = originalMediaUrl(settings?.logo)
  const siteName = settings?.siteName || 'Atomic Digital'

  return (
    <header className="atomic-site-header">
      <div className="atomic-site-header__inner">
        <Link href="/" className="atomic-site-header__brand" aria-label={`${siteName} home`}>
          {logoUrl ? (
            // The logo comes from the global Brand settings, so an img keeps it CMS-configurable.
            <img src={logoUrl} alt={siteName} className="atomic-site-header__logo" />
          ) : (
            <span className="atomic-site-header__wordmark">
              <span>ATOMIC</span> DIGITAL
            </span>
          )}
        </Link>

        <NavLinks items={settings?.primaryNavigation} className="atomic-site-header__menu" label="Primary navigation" />

        <Link href="/contact" className="atomic-site-header__contact">
          Contact
        </Link>
      </div>
    </header>
  )
}

export function SiteFooter({ settings }: { settings: SiteSettingsDocument | null }) {
  const logoUrl = originalMediaUrl(settings?.logo)
  const siteName = settings?.siteName || 'Atomic Digital'
  const footerItems = settings?.footerNavigation?.length ? settings.footerNavigation : settings?.primaryNavigation
  const hasContact = settings?.email || settings?.phone || settings?.address

  return (
    <footer className="atomic-site-footer">
      <div className="atomic-site-footer__inner">
        <div className="atomic-site-footer__brand-column">
          <Link href="/" className="atomic-site-footer__brand" aria-label={`${siteName} home`}>
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="atomic-site-footer__logo" />
            ) : (
              <span className="atomic-site-footer__wordmark">
                <span>ATOMIC</span> DIGITAL
              </span>
            )}
          </Link>
          {settings?.footerBlurb ? <p>{settings.footerBlurb}</p> : null}
        </div>

        {footerItems?.length ? <NavLinks items={footerItems} className="atomic-site-footer__menu" label="Footer navigation" /> : null}

        {hasContact ? (
          <div className="atomic-site-footer__contact">
            <p className="atomic-site-footer__eyebrow">Start a conversation</p>
            {settings?.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {settings?.phone ? <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a> : null}
            {settings?.address ? <p className="atomic-site-footer__address">{settings.address}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="atomic-site-footer__base">
        <span>© {new Date().getFullYear()} {siteName}</span>
        {settings?.socialLinks?.length ? (
          <div className="atomic-site-footer__socials" aria-label="Social links">
            {settings.socialLinks.map((social, index) =>
              social.platform && social.url ? (
                <a key={`${social.platform}-${index}`} href={social.url} target="_blank" rel="noreferrer">
                  {social.platform}
                </a>
              ) : null,
            )}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
