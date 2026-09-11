import Script from 'next/script'

const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/
const ADS_ID_PATTERN = /^AW-[A-Z0-9]+$/
const EVENT_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/

export function Ga4Script({
  measurementId,
  googleAdsId,
  conversionEventName,
}: {
  measurementId?: string
  googleAdsId?: string
  conversionEventName?: string
}) {
  const ga4 = measurementId && GA4_ID_PATTERN.test(measurementId) ? measurementId : null
  const ads = googleAdsId && ADS_ID_PATTERN.test(googleAdsId) ? googleAdsId : null
  const conversionEvent =
    conversionEventName && EVENT_NAME_PATTERN.test(conversionEventName) ? conversionEventName : null

  if (!ga4 && !ads) return null

  const configs = [ga4, ads]
    .filter(Boolean)
    .map((id) => `gtag('config','${id}');`)
    .join('')

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4 ?? ads}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${configs}`}
      </Script>
      {conversionEvent ? (
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`window.__adsConversionEvent='${conversionEvent}';` +
            // Google's delayed-navigation helper: fires the conversion, then follows
            // the URL (or gives up after the timeout). Use it for link/button clicks.
            `window.gtagSendEvent=function(url){var callback=function(){if(typeof url==='string'){window.location=url}};` +
            `if(typeof window.gtag==='function'){window.gtag('event','${conversionEvent}',{event_callback:callback,event_timeout:2000})}else{callback()}` +
            `return false};`}
        </Script>
      ) : null}
    </>
  )
}
