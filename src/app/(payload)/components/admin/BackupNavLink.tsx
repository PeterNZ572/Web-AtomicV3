'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BackupNavLink() {
  const pathname = usePathname()
  const isActive = pathname?.startsWith('/admin/backup')

  return (
    <div style={{ padding: '0 16px 2px' }}>
      <Link
        href="/admin/backup"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '7px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '13.5px',
          fontWeight: isActive ? '600' : '400',
          color: isActive ? 'var(--color-base-0)' : 'var(--color-base-500)',
          backgroundColor: isActive ? 'var(--theme-elevation-150)' : 'transparent',
          transition: 'color 0.15s, background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-base-0)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-base-500)'
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Backup Manager
      </Link>
    </div>
  )
}
