import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getProjectBySlug } from '@/_site-specific/lib/content'
import type { ProjectDocument } from '@/_site-specific/lib/types'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { resolveMediaUrl } from '@/components/page-builder/helpers'
import type { MediaDocument, TestimonialDocument } from '@/lib/types'
import { buildMetadata } from '@/lib/seo'

import styles from '../projects.module.css'

// Rendered per request for the same reason as (site)/[slug]: the database
// isn't reachable at Docker build time, so paths can't be enumerated.
type Props = { params: Promise<{ slug: string }> }

const serviceLabels = (services: ProjectDocument['services']) =>
  (Array.isArray(services) ? services : [])
    .map((service) => (typeof service === 'string' ? service : service?.item))
    .filter((label): label is string => Boolean(label))

const asTestimonial = (value: ProjectDocument['testimonial']): TestimonialDocument | null =>
  value && typeof value === 'object' && 'quote' in value ? value : null

const hasRichText = (value: unknown) =>
  Boolean(value && typeof value === 'object' && 'root' in (value as Record<string, unknown>))

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}

  return buildMetadata({
    title: project.seo?.title || `${project.title} — Project`,
    description: project.seo?.description || project.summary,
    canonicalUrl: project.seo?.canonicalUrl,
    image: project.seo?.openGraphImage || (project.heroImage as MediaDocument | undefined),
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const services = serviceLabels(project.services)
  const results = (project.results || []).filter((result) => result.value || result.label)
  const heroImage = resolveMediaUrl(project.heroImage as MediaDocument | string | undefined)
  const gallery = (project.gallery || [])
    .map((item) => resolveMediaUrl(item as MediaDocument | string))
    .filter((url): url is string => Boolean(url))
  const testimonial = asTestimonial(project.testimonial)
  const demoUrl = project.demo?.url?.trim() || null

  const story = [
    { label: 'Challenge', content: project.challenge },
    { label: 'Solution', content: project.solution },
    { label: 'Outcome', content: project.outcome },
  ].filter((entry) => hasRichText(entry.content))

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.eyebrow}>
            Project{project.industry ? ` / ${project.industry}` : ''}
          </div>
          <h1>{project.title}</h1>

          <div className={styles.heroBottom}>
            <p className={styles.summary}>{project.summary}</p>

            <div className={styles.meta}>
              <div>
                <small>Client</small>
                <strong>{project.client}</strong>
              </div>
              {project.industry ? (
                <div>
                  <small>Industry</small>
                  <strong>{project.industry}</strong>
                </div>
              ) : null}
              {demoUrl ? (
                <div>
                  <small>Demo</small>
                  <strong>
                    <a
                      className={styles.demoLink}
                      href={demoUrl}
                      target={demoUrl.startsWith('/') ? undefined : '_blank'}
                      rel={demoUrl.startsWith('/') ? undefined : 'noreferrer'}
                    >
                      {project.demo?.name || 'View demo'} →
                    </a>
                  </strong>
                </div>
              ) : null}
            </div>
          </div>

          {services.length ? (
            <div className={styles.serviceStrip}>
              {services.map((service) => (
                <div key={service} className={styles.serviceChip}>
                  {service}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {heroImage ? (
        <div className={styles.heroImageSection}>
          <div className={styles.heroImage}>
            <Image src={heroImage} alt={project.title} width={1600} height={1100} unoptimized priority />
          </div>
        </div>
      ) : null}

      {story.length ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            {story.map((entry) => (
              <div key={entry.label} className={styles.storyBlock}>
                <div className={styles.label}>{entry.label}</div>
                <div className={styles.storyCopy}>
                  <RichTextContent content={entry.content} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {results.length ? (
        <section className={styles.resultsSection}>
          <div className={styles.wrap}>
            <div className={styles.splitHead}>
              <div className={styles.label}>Results</div>
              <h2>The useful part isn&apos;t the software. It&apos;s what stops being difficult.</h2>
            </div>

            <div className={styles.resultsGrid}>
              {results.map((result, index) => {
                // `value` is meant to be a short stat ("40%", "3 hrs/wk") shown
                // large. Authors often write a full sentence instead, which
                // reads badly at 56px — fall back to the mockup's sequence
                // number and let the sentence be the heading.
                const stat = result.value && result.value.length <= 14 ? result.value : null
                const heading = result.label || result.value
                const body = result.value && result.value !== heading && result.value !== stat

                return (
                  <div key={`${result.label}-${index}`} className={styles.result}>
                    <div className={styles.resultNum}>
                      {stat || String(index + 1).padStart(2, '0')}
                    </div>
                    <h3>{heading}</h3>
                    {body ? <p>{result.value}</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.splitHead}>
              <div className={styles.label}>Gallery</div>
              <h2>A closer look at the system.</h2>
            </div>

            <div className={styles.galleryGrid}>
              {gallery.map((url, index) => (
                <div key={url} className={styles.galleryCard}>
                  <Image
                    src={url}
                    alt={`${project.title} — image ${index + 1}`}
                    width={1200}
                    height={900}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonial ? (
        <section className={styles.quoteSection}>
          <div className={`${styles.wrap} ${styles.quoteWrap}`}>
            <div className={styles.label}>Client feedback</div>
            <div>
              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div className={styles.quoteBy}>
                {[testimonial.name, testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.cta}>
        <div className={`${styles.wrap} ${styles.ctaGrid}`}>
          <div>
            <small>Have a similar problem?</small>
          </div>
          <div>
            <h2>Tell me what&apos;s creating unnecessary work.</h2>
            <Link className={styles.ctaButton} href="/contact">
              START A CONVERSATION →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
