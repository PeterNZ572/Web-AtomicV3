'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

export type ResolvedNavItem = { label: string; href: string; external: boolean }

export function MobileNav({
  items,
  ctaLabel,
  ctaHref,
}: {
  items: ResolvedNavItem[]
  ctaLabel: string
  ctaHref: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  useEffect(() => setMounted(true), [])

  // A hash link keeps the same pathname, so the panel also closes on link click.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="atomic-site-header__burger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="atomic-site-header__burger-bars" data-open={open || undefined} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Portalled to <body>: inside the header the drawer is trapped in that
          element's `z-index: 20` stacking context and page content paints over it. */}
      {mounted && open
        ? createPortal(
            <>
              <div className="atomic-mobile-nav__overlay" onClick={() => setOpen(false)} />

              <div id={panelId} className="atomic-mobile-nav">
                <nav className="atomic-mobile-nav__menu" aria-label="Primary navigation">
                  {items.map((item, index) =>
                    item.external ? (
                      <a
                        key={`${item.label}-${index}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link key={`${item.label}-${index}`} href={item.href} onClick={() => setOpen(false)}>
                        {item.label}
                      </Link>
                    ),
                  )}
                </nav>

                <Link href={ctaHref} className="atomic-mobile-nav__cta" onClick={() => setOpen(false)}>
                  {ctaLabel}
                </Link>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  )
}
