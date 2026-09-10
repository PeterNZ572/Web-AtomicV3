import { AtomicHero } from '@/_site-specific/components/AtomicHero'
import { PageRenderer } from '@/components/page-builder/page-renderer'
import { getPageBySlugFresh } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // The visual builder's homepage uses `/` as its slug. Keep the legacy
  // `home` lookup as a fallback for sites copied from the original starter.
  const page = (await getPageBySlugFresh('/')) || (await getPageBySlugFresh('home'))

  return (
    <main>
      <AtomicHero />
      <PageRenderer sections={page?.contentBuilder} />
    </main>
  )
}
