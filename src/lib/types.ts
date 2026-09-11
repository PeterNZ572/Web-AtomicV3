export type MediaDocument = {
  id: string
  url?: string
  alt?: string
  filename?: string
  mimeType?: string
  sizes?: Record<string, { url?: string }>
}

export type SeoFields = {
  title?: string
  description?: string
  canonicalUrl?: string
  openGraphImage?: MediaDocument | string
  noIndex?: boolean
  noFollow?: boolean
  schemaType?: string
}

export type HideSetting = 'no' | 'all' | 'mobile' | 'tablet' | 'desktop'
export type ThemeStyle = 'default' | 'light' | 'dark' | 'primary' | 'accent' | 'muted'
export type VerticalAlignment = 'top' | 'middle' | 'bottom'
export type PaddingLevel = 'none' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5'
export type FullWidthSetting = 'no' | 'yes'
export type RowLayout =
  | 'full'
  | 'half-half'
  | 'third-third-third'
  | 'quarter-quarter-quarter-quarter'
  | 'third-two-thirds'
  | 'two-thirds-third'
  | 'quarter-three-quarters'
  | 'three-quarters-quarter'
  | 'half-quarter-quarter'
  | 'quarter-half-quarter'
  | 'quarter-quarter-half'

export type BuilderContentBase = {
  blockType: string
  blockName?: string
  customCssClass?: string
  customCssId?: string
  customInlineStyle?: string
  hide?: HideSetting
  [key: string]: unknown
}

export type BuilderColumn = {
  columnName?: string
  customCssClass?: string
  customCssId?: string
  customInlineStyle?: string
  hide?: HideSetting
  contentBlocks?: BuilderContentBase[]
}

export type BuilderRow = {
  rowName?: string
  rowLayout?: RowLayout
  customCssClass?: string
  customCssId?: string
  customInlineStyle?: string
  hide?: HideSetting
  column1?: BuilderColumn
  column2?: BuilderColumn
  column3?: BuilderColumn
  column4?: BuilderColumn
}

export type BuilderSection = {
  sectionName?: string
  themeStyle?: ThemeStyle
  verticalAlignment?: VerticalAlignment
  paddingLevel?: PaddingLevel
  fullWidth?: FullWidthSetting
  customCssClass?: string
  customCssId?: string
  customInlineStyle?: string
  hide?: HideSetting
  customBackgroundImage?: MediaDocument | string
  backgroundRepeat?: string
  backgroundSize?: string
  backgroundPosition?: string
  rows?: BuilderRow[]
}

export type PageDocument = {
  id: string
  title: string
  slug: string
  excerpt?: string
  contentBuilder?: BuilderSection[]
  seo?: SeoFields
}

export type TestimonialDocument = {
  id: string
  name: string
  role?: string
  company?: string
  quote: string
  featured?: boolean
  avatar?: MediaDocument | string
}

// ProjectDocument lives in src/_site-specific/lib/types.ts

export type SiteSettingsDocument = {
  siteName?: string
  siteTagline?: string
  logo?: MediaDocument | string
  favicon?: MediaDocument | string
  announcement?: string
  primaryNavigation?: { label?: string; slug?: string }[]
  footerNavigation?: { label?: string; slug?: string }[]
  footerBlurb?: string
  email?: string
  phone?: string
  address?: string
  socialLinks?: { platform?: string; url?: string }[]
  globalCustomCss?: string
  ga4MeasurementId?: string
  googleAdsId?: string
  googleAdsConversionEvent?: string
  seo?: SeoFields
}
