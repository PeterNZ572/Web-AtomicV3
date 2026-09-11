import type { ReactNode } from 'react'

import { Ga4Script } from '@/components/analytics/ga4-script'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { getSiteSettings } from '@/lib/content'

export const revalidate = 3600

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <div className="site-shell">
      <Ga4Script
        measurementId={settings?.ga4MeasurementId ?? undefined}
        googleAdsId={settings?.googleAdsId ?? undefined}
        conversionEventName={settings?.googleAdsConversionEvent ?? undefined}
      />
      {settings?.globalCustomCss ? <style>{settings.globalCustomCss}</style> : null}
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  )
}
