import React from 'react'
import Link from 'next/link'

import { getPayloadClient } from '../../../lib/payload'

const PageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ProjectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="3" width="6" height="6" rx="1" />
    <rect x="16" y="3" width="6" height="6" rx="1" />
    <rect x="2" y="10" width="6" height="6" rx="1" />
    <rect x="9" y="10" width="6" height="6" rx="1" />
    <rect x="16" y="10" width="6" height="6" rx="1" />
    <rect x="2" y="17" width="6" height="6" rx="1" />
    <rect x="9" y="17" width="6" height="6" rx="1" />
  </svg>
)

const MediaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const TestimonialIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const FormIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export const DashboardHero = async () => {
  const payload = await getPayloadClient()

  const [pages, projects, media, testimonials, submissions] = await Promise.all([
    payload.count({ collection: 'pages' }),
    payload.count({ collection: 'projects' }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'testimonials' }),
    payload.count({ collection: 'contact-submissions' }),
  ])

  const recentSubmissions = await payload.find({
    collection: 'contact-submissions',
    limit: 5,
    sort: '-createdAt',
  })

  const dateStr = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const stats = [
    { label: 'Pages', count: pages.totalDocs, href: '/admin/collections/pages', Icon: PageIcon, color: '#008cff' },
    { label: 'Projects', count: projects.totalDocs, href: '/admin/collections/projects', Icon: ProjectIcon, color: '#7dff00' },
    { label: 'Media', count: media.totalDocs, href: '/admin/collections/media', Icon: MediaIcon, color: '#44adff' },
    { label: 'Testimonials', count: testimonials.totalDocs, href: '/admin/collections/testimonials', Icon: TestimonialIcon, color: '#008cff' },
    { label: 'Submissions', count: submissions.totalDocs, href: '/admin/collections/contact-submissions', Icon: FormIcon, color: '#7dff00' },
  ]

  return (
    <div className="atomic-dashboard">
      {/* Welcome banner */}
      <div className="atomic-dashboard__banner">
        <div>
          <p className="atomic-dashboard__eyebrow">Content Management</p>
          <h1 className="atomic-dashboard__title">Atomic CMS</h1>
          <p className="atomic-dashboard__date">{dateStr}</p>
        </div>
        <svg className="atomic-dashboard__banner-mark" aria-hidden="true" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 4L58 18.5V45.5L32 60L6 45.5V18.5L32 4Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M32 16L46 24V40L32 48L18 40V24L32 16Z" fill="rgba(255,255,255,0.92)" />
          <path d="M32 24L39 28V36L32 40L25 36V28L32 24Z" fill="#008cff" />
        </svg>
      </div>

      {/* Stats grid */}
      <div className="atomic-dashboard__stats">
        {stats.map(({ label, count, href, Icon, color }) => (
          <a key={label} href={href} className="atomic-dashboard__stat">
            <div className="atomic-dashboard__stat-icon" style={{ color }}>
              <Icon />
            </div>
            <div className="atomic-dashboard__stat-count" style={{ color }}>{count}</div>
            <div className="atomic-dashboard__stat-label">{label}</div>
            <div className="atomic-dashboard__stat-arrow"><ArrowIcon /></div>
          </a>
        ))}
      </div>

      {/* Recent submissions */}
      {recentSubmissions.docs.length > 0 && (
        <div className="atomic-dashboard__submissions">
          <div className="atomic-dashboard__section-header">
            <span className="atomic-dashboard__section-title">Recent Submissions</span>
            <Link href="/admin/collections/contact-submissions" className="atomic-dashboard__section-link">
              View all <ArrowIcon />
            </Link>
          </div>
          <div className="atomic-dashboard__submissions-list">
            {recentSubmissions.docs.map((sub) => {
              const createdAt = typeof sub.createdAt === 'string' ? sub.createdAt : String(sub.createdAt)
              const date = new Date(createdAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              return (
                <a
                  key={sub.id}
                  href={`/admin/collections/contact-submissions/${sub.id}`}
                  className="atomic-dashboard__submission-row"
                >
                  <div className="atomic-dashboard__submission-dot" />
                  <div className="atomic-dashboard__submission-info">
                    <span className="atomic-dashboard__submission-form">{sub.formTitle}</span>
                    {sub.pageTitle && (
                      <span className="atomic-dashboard__submission-page">{sub.pageTitle}</span>
                    )}
                  </div>
                  <span className="atomic-dashboard__submission-date">{date}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
