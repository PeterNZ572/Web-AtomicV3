import type { CSSProperties } from 'react'

export const sectionThemeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Primary', value: 'primary' },
  { label: 'Accent', value: 'accent' },
  { label: 'Muted', value: 'muted' },
] as const

export const verticalAlignmentOptions = [
  { label: 'Top (Default)', value: 'top' },
  { label: 'Middle', value: 'middle' },
  { label: 'Bottom', value: 'bottom' },
] as const

export const paddingLevelOptions = [
  { label: 'None', value: 'none' },
  { label: 'Level 1', value: 'level1' },
  { label: 'Level 2', value: 'level2' },
  { label: 'Level 3', value: 'level3' },
  { label: 'Level 4', value: 'level4' },
  { label: 'Level 5', value: 'level5' },
] as const

export const yesNoOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
] as const

export const hideOptions = [
  { label: 'No', value: 'no' },
  { label: 'Hide on all devices', value: 'all' },
  { label: 'Hide on mobile', value: 'mobile' },
  { label: 'Hide on tablet', value: 'tablet' },
  { label: 'Hide on desktop', value: 'desktop' },
] as const

export const backgroundRepeatOptions = [
  { label: 'No Repeat', value: 'no-repeat' },
  { label: 'Repeat', value: 'repeat' },
  { label: 'Repeat X', value: 'repeat-x' },
  { label: 'Repeat Y', value: 'repeat-y' },
] as const

export const backgroundSizeOptions = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Auto', value: 'auto' },
] as const

export const backgroundPositionOptions = [
  { label: 'Center', value: 'center' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Center Top', value: 'center top' },
  { label: 'Center Bottom', value: 'center bottom' },
] as const

export const rowLayoutOptions = [
  { label: 'Full', value: 'full' },
  { label: '1/2 + 1/2', value: 'half-half' },
  { label: '1/3 + 1/3 + 1/3', value: 'third-third-third' },
  { label: '1/4 + 1/4 + 1/4 + 1/4', value: 'quarter-quarter-quarter-quarter' },
  { label: '1/3 + 2/3', value: 'third-two-thirds' },
  { label: '2/3 + 1/3', value: 'two-thirds-third' },
  { label: '1/4 + 3/4', value: 'quarter-three-quarters' },
  { label: '3/4 + 1/4', value: 'three-quarters-quarter' },
  { label: '1/2 + 1/4 + 1/4', value: 'half-quarter-quarter' },
  { label: '1/4 + 1/2 + 1/4', value: 'quarter-half-quarter' },
  { label: '1/4 + 1/4 + 1/2', value: 'quarter-quarter-half' },
] as const

export const rowLayoutTemplates: Record<string, string> = {
  full: 'grid-cols-1',
  'half-half': 'md:grid-cols-2',
  'third-third-third': 'md:grid-cols-3',
  'quarter-quarter-quarter-quarter': 'md:grid-cols-4',
  'third-two-thirds': 'md:grid-cols-[1fr_2fr]',
  'two-thirds-third': 'md:grid-cols-[2fr_1fr]',
  'quarter-three-quarters': 'md:grid-cols-[1fr_3fr]',
  'three-quarters-quarter': 'md:grid-cols-[3fr_1fr]',
  'half-quarter-quarter': 'md:grid-cols-[2fr_1fr_1fr]',
  'quarter-half-quarter': 'md:grid-cols-[1fr_2fr_1fr]',
  'quarter-quarter-half': 'md:grid-cols-[1fr_1fr_2fr]',
}

export const rowLayoutLabels: Record<string, string> = Object.fromEntries(
  rowLayoutOptions.map((option) => [option.value, option.label]),
)

const layoutColumnCounts: Record<string, number> = {
  full: 1,
  'half-half': 2,
  'third-third-third': 3,
  'quarter-quarter-quarter-quarter': 4,
  'third-two-thirds': 2,
  'two-thirds-third': 2,
  'quarter-three-quarters': 2,
  'three-quarters-quarter': 2,
  'half-quarter-quarter': 3,
  'quarter-half-quarter': 3,
  'quarter-quarter-half': 3,
}

export const getColumnCount = (layout?: string | null) => layoutColumnCounts[layout || 'full'] || 1

export const getHideClassName = (hide?: string | null) => {
  switch (hide) {
    case 'all':
      return 'hidden'
    case 'mobile':
      return 'hidden md:block'
    case 'tablet':
      return 'md:hidden lg:block'
    case 'desktop':
      return 'lg:hidden'
    default:
      return ''
  }
}

export const parseInlineStyle = (value?: string | null): CSSProperties | undefined => {
  if (!value) {
    return undefined
  }

  const styleEntries = value
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => rule.split(':'))
    .filter((parts) => parts.length >= 2)
    .map(([property, ...rest]) => {
      const camelProperty = property
        .trim()
        .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

      return [camelProperty, rest.join(':').trim()]
    })

  if (!styleEntries.length) {
    return undefined
  }

  return Object.fromEntries(styleEntries) as CSSProperties
}
