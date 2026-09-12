import Link from 'next/link'

import { getProjects } from '@/_site-specific/lib/content'
import { buildMetadata } from '@/lib/seo'

import styles from './projects.module.css'

// A fixed path with no params would otherwise be prerendered at build time,
// where the database isn't reachable — baking the empty state into the page.
// (site)/page.tsx opts out for the same reason; the [slug] routes are already
// dynamic because they have params and no generateStaticParams.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata({
    title: 'Projects — Atomic Digital',
    description:
      'Case studies from Atomic Digital: custom business systems, reporting and automation work for New Zealand businesses.',
  })
}

export default async function ProjectsIndexPage() {
  const projects = await getProjects({ limit: 100 })

  return (
    <main className={styles.page}>
      <header className={styles.indexHero}>
        <div className={styles.wrap}>
          <div className={styles.eyebrow}>Projects</div>
          <h1>
            Work that removed <span>real friction.</span>
          </h1>
          <p className={styles.indexLead}>
            A look at the systems, reporting and automation work behind some of the businesses I
            have worked with.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.wrap}>
          {projects.length ? (
            <div className={styles.cardGrid}>
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardIndustry}>{project.industry || 'Project'}</span>
                    <span className={styles.cardClient}>{project.client}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <span className={styles.cardLink}>View project →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>No projects have been published yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}
