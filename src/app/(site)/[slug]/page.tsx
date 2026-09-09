import { notFound } from 'next/navigation'

import { PageRenderer } from '@/components/page-builder/page-renderer'
import { getPageBySlug } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

// This route renders per-request (no generateStaticParams — the DB isn't
// available at Docker build time, so build-time path enumeration isn't
// possible here). Caching instead happens at the data layer: getPageBySlug
// (src/lib/content.ts) wraps its Payload query in unstable_cache, which is
// what actually keeps repeat requests off the database.
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return buildMetadata({
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    canonicalUrl: page.seo?.canonicalUrl,
    image: page.seo?.openGraphImage,
  })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return (
    <main>
      <PageRenderer sections={page.contentBuilder} />
    </main>
  )
}
