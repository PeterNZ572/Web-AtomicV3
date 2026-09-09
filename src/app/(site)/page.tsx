import Link from 'next/link'
import { getPageBySlug } from '@/lib/content'
import { PageRenderer } from '@/components/page-builder/page-renderer'

export const revalidate = 3600

export default async function HomePage() {
  const page = await getPageBySlug('home')

  if (!page) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome to Atomic CMS</h1>
        <p>No home page found. <Link href="/admin">Go to admin</Link> to create one.</p>
      </main>
    )
  }

  return (
    <main>
      <PageRenderer sections={page.contentBuilder} />
    </main>
  )
}
