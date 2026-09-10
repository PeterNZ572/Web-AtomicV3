import type { ReactNode } from 'react'

import { Ga4Script } from '@/components/analytics/ga4-script'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { getSiteSettings } from '@/lib/content'

export const revalidate = 3600

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <div className="site-shell">
      {settings?.ga4MeasurementId ? <Ga4Script measurementId={settings.ga4MeasurementId} /> : null}
      {settings?.globalCustomCss ? <style>{settings.globalCustomCss}</style> : null}
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  )
}
