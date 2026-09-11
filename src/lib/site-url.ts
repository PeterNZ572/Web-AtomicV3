const LOCAL_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1']

const isLocal = (url: string) => {
  try {
    return LOCAL_HOSTS.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

const normalise = (url?: string | null) => {
  const trimmed = url?.trim()
  if (!trimmed) return undefined

  try {
    // Drops any trailing slash, path, query or hash so callers can safely append `/slug`
    return new URL(trimmed).origin
  } catch {
    return undefined
  }
}

/**
 * Resolves the public origin of the site, without a trailing slash.
 *
 * A configured URL wins over a localhost one regardless of order, so a stale
 * `http://localhost:3000` left in the CMS canonical URL can't leak into the
 * sitemap, robots.txt or canonical tags of a deployed site.
 */
export const getSiteUrl = (canonicalUrl?: string | null) => {
  const candidates = [
    canonicalUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
  ]
    .map(normalise)
    .filter((url): url is string => Boolean(url))

  return candidates.find((url) => !isLocal(url)) || candidates[0] || 'http://localhost:3000'
}

/**
 * Same as `getSiteUrl`, but falls back to the origin of the incoming request when
 * nothing else resolves to a public URL. Used by `sitemap.xml` and `robots.txt` so a
 * missing `NEXT_PUBLIC_SITE_URL` on the deploy host can't publish localhost URLs to
 * search engines. Reading headers opts the route out of static rendering.
 */
export const getRequestSiteUrl = async (canonicalUrl?: string | null) => {
  const configured = getSiteUrl(canonicalUrl)
  if (!isLocal(configured)) return configured

  try {
    const { headers } = await import('next/headers')
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    const protocol = headerList.get('x-forwarded-proto') || 'https'
    const fromRequest = normalise(host ? `${protocol}://${host}` : undefined)

    if (fromRequest && !isLocal(fromRequest)) return fromRequest
  } catch {
    // No request context (build-time render) — fall through to the configured value
  }

  return configured
}

/** Builds an absolute URL for a page slug, tolerating slugs stored as `/`, `home` or `/about/`. */
export const getPageUrl = (baseUrl: string, slug?: string | null) => {
  const path = (slug || '').replace(/^\/+|\/+$/g, '')

  return !path || path === 'home' ? `${baseUrl}/` : `${baseUrl}/${path}`
}
