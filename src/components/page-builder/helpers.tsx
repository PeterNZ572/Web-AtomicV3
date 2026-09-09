import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

import { getHideClassName, parseInlineStyle } from '../../lib/builder-config'
import type {
  BuilderColumn,
  BuilderContentBase,
  BuilderRow,
  BuilderSection,
  MediaDocument,
} from '../../lib/types'
import { cn } from '../../lib/utils'

export const resolveMediaUrl = (media?: MediaDocument | string | null) => {
  if (!media) {
    return undefined
  }

  if (typeof media === 'string') {
    return media
  }

  return media.url
}

export const getThemeClassName = (theme?: string | null) => {
  switch (theme) {
    case 'light':
      return 'bg-white text-brand-dark'
    case 'dark':
      return 'bg-brand-dark text-white'
    case 'primary':
      return 'bg-brand-blue text-white'
    case 'accent':
      return 'bg-[#0f1d34] text-white'
    case 'muted':
      return 'bg-[#e8edf3] text-brand-dark'
    default:
      return 'bg-transparent text-brand-dark'
  }
}

export const getPaddingClassName = (padding?: string | null) => {
  switch (padding) {
    case 'none':
      return 'py-0'
    case 'level1':
      return 'py-8'
    case 'level2':
      return 'py-12'
    case 'level3':
      return 'py-16'
    case 'level4':
      return 'py-24'
    case 'level5':
      return 'py-32'
    default:
      return 'py-24'
  }
}

export const getVerticalAlignmentClassName = (alignment?: string | null) => {
  switch (alignment) {
    case 'middle':
      return 'justify-center'
    case 'bottom':
      return 'justify-end'
    default:
      return 'justify-start'
  }
}

export const buildBackgroundStyle = (section: BuilderSection): CSSProperties => {
  const inlineStyle = parseInlineStyle(section.customInlineStyle) || {}
  const backgroundImage = resolveMediaUrl(section.customBackgroundImage)

  return {
    ...inlineStyle,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : inlineStyle.backgroundImage,
    backgroundRepeat: section.backgroundRepeat || inlineStyle.backgroundRepeat,
    backgroundSize: section.backgroundSize || inlineStyle.backgroundSize,
    backgroundPosition: section.backgroundPosition || inlineStyle.backgroundPosition,
  }
}

export const buildInlineStyle = (entity: BuilderSection | BuilderRow | BuilderColumn | BuilderContentBase) =>
  parseInlineStyle(entity.customInlineStyle)

export const blockTextTone = (theme?: string | null, subtle = false) => {
  const darkTheme = ['dark', 'primary', 'accent'].includes(theme || '')

  if (darkTheme) {
    return subtle ? 'text-white/72' : 'text-white'
  }

  return subtle ? 'text-brand-gunmetal/78' : 'text-brand-dark'
}

export const SmartLink = ({
  href,
  children,
  className,
  newTab,
}: {
  href?: string
  children: ReactNode
  className?: string
  newTab?: boolean
}) => {
  if (!href) {
    return <span className={className}>{children}</span>
  }

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer' : undefined}>
      {children}
    </a>
  )
}

export const buttonClassName = (style?: string | null) =>
  cn(
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200',
    style === 'secondary' && 'bg-white text-brand-dark hover:bg-white/90',
    style === 'outline' && 'border border-current bg-transparent hover:bg-current/10',
    style === 'text' && 'bg-transparent px-0 text-brand-blue underline-offset-4 hover:underline',
    (!style || style === 'primary') && 'bg-brand-blue text-white shadow-glow hover:bg-sky-500',
  )

export const wrapperClassName = ({
  customCssClass,
  hide,
}: {
  customCssClass?: string | null
  hide?: string | null
}) => cn(getHideClassName(hide), customCssClass)
