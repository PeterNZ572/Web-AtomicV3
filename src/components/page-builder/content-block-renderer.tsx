import Image from 'next/image'
import * as LucideIcons from 'lucide-react'

import { RichTextContent } from '../ui/rich-text-content'
import type { BuilderContentBase, TestimonialDocument } from '../../lib/types'
import { cn } from '../../lib/utils'

import { FormBlockView } from './form-block-view'
import { blockTextTone, buildInlineStyle, buttonClassName, resolveMediaUrl, SmartLink, wrapperClassName } from './helpers'

const asTestimonial = (value: unknown): TestimonialDocument | null =>
  value && typeof value === 'object' && 'quote' in value ? (value as TestimonialDocument) : null

const resolveLucideIcon = (value?: unknown) => {
  if (typeof value !== 'string' || !value) return null

  const iconName = value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return (LucideIcons as any)[iconName] || null
}

const youtubeEmbed = (url?: string) => {
  if (!url) return undefined
  const match = url.match(/(?:v=|be\/)([\w-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

const vimeoEmbed = (url?: string) => {
  if (!url) return undefined
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? `https://player.vimeo.com/video/${match[1]}` : url
}

export const ContentBlockRenderer = async ({ block, theme }: { block: BuilderContentBase; theme?: string }) => {
  const dark = ['dark', 'primary', 'accent'].includes(theme || '')
  const textClass = blockTextTone(theme)
  const subtleClass = blockTextTone(theme, true)
  const shellClass = cn(wrapperClassName(block), block.blockType !== 'text' && block.blockType !== 'buttons' && 'rounded-[28px]')

  const shellProps = {
    id: block.customCssId || undefined,
    className: shellClass,
    style: buildInlineStyle(block),
  }

  switch (block.blockType) {
    case 'text':
      return (
        <div {...shellProps}>
          {typeof block.content === 'string' ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
          ) : (
            <RichTextContent content={block.content} dark={dark} />
          )}
        </div>
      )
    case 'image': {
      const imageUrl = resolveMediaUrl(block.image as any)
      if (!imageUrl) return null

      const image = (
        <Image
          src={imageUrl}
          alt={typeof block.altText === 'string' ? block.altText : ''}
          width={1600}
          height={1100}
          unoptimized
          className="h-auto w-full rounded-[28px] object-cover"
        />
      )

      return (
        <figure {...shellProps}>
          {typeof block.linkUrl === 'string' && block.linkUrl ? (
            <SmartLink href={block.linkUrl} newTab={Boolean(block.newTab)}>
              {image}
            </SmartLink>
          ) : (
            image
          )}
          {typeof block.caption === 'string' && block.caption ? <figcaption className={cn('mt-3 text-sm', subtleClass)}>{block.caption}</figcaption> : null}
        </figure>
      )
    }
    case 'buttons':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'flex flex-wrap gap-4')}>
          {(Array.isArray(block.buttons) ? block.buttons : []).map((button: any, index) => (
            <SmartLink key={index} href={button.url} newTab={button.newTab} className={buttonClassName(button.style)}>
              {button.label}
            </SmartLink>
          ))}
        </div>
      )
    case 'form':
      return (
        <div {...shellProps}>
          <FormBlockView
            formTitle={block.formTitle as string | undefined}
            formDescription={block.formDescription as string | undefined}
            recipientEmail={block.recipientEmail as string | undefined}
            fields={(block.fields as any[]) || []}
            showFieldLabels={block.showFieldLabels as boolean | undefined}
            submitButtonText={block.submitButtonText as string | undefined}
            privacyNote={block.privacyNote as string | undefined}
            successMessage={block.successMessage as string | undefined}
            dark={dark}
          />
        </div>
      )
    case 'map': {
      const address = typeof block.address === 'string' ? block.address : ''
      const lat = typeof block.latitude === 'string' ? block.latitude : ''
      const lng = typeof block.longitude === 'string' ? block.longitude : ''
      const zoom = typeof block.zoom === 'number' ? block.zoom : 14
      const mapHeight = typeof block.mapHeight === 'string' ? block.mapHeight : '420px'
      const query = lat && lng ? `${lat},${lng}` : address

      return (
        <div {...shellProps} className={cn(shellProps.className, 'overflow-hidden rounded-[30px] border border-brand-dark/10 bg-white shadow-panel')}>
          <iframe
            title={address || 'Map'}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`}
            className="w-full border-0"
            style={{ height: mapHeight }}
          />
        </div>
      )
    }
    case 'gallery': {
      const images = Array.isArray(block.images) ? block.images : []
      const layout = block.galleryLayout

      return (
        <div {...shellProps} className={cn(shellProps.className, layout === 'carousel' ? 'flex gap-4 overflow-x-auto pb-2' : layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 [column-gap:1rem]' : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3')}>
          {images.map((item: any, index: number) => {
            const imageUrl = resolveMediaUrl(item.image)
            if (!imageUrl) return null

            return (
              <figure key={index} className={cn('overflow-hidden rounded-[24px] border border-brand-dark/10 bg-white shadow-panel', layout === 'carousel' && 'min-w-[320px]')}>
                <Image src={imageUrl} alt={item.caption || ''} width={1200} height={900} unoptimized className="h-auto w-full object-cover" />
                {item.caption ? <figcaption className="px-4 py-3 text-sm text-brand-gunmetal/75">{item.caption}</figcaption> : null}
              </figure>
            )
          })}
        </div>
      )
    }
    case 'slider':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'flex snap-x gap-5 overflow-x-auto pb-2')}>
          {(Array.isArray(block.slides) ? block.slides : []).map((slide: any, index) => {
            const imageUrl = resolveMediaUrl(slide.image)
            return (
              <article key={index} className="min-w-[320px] snap-start overflow-hidden rounded-[28px] border border-brand-dark/10 bg-white shadow-panel md:min-w-[420px]">
                {imageUrl ? <Image src={imageUrl} alt={slide.heading || ''} width={1200} height={720} unoptimized className="h-60 w-full object-cover" /> : null}
                <div className="p-6">
                  {slide.heading ? <h3 className="font-heading text-2xl font-semibold text-brand-dark">{slide.heading}</h3> : null}
                  {slide.text ? <p className="mt-3 text-base leading-7 text-brand-gunmetal/78">{slide.text}</p> : null}
                  {slide.buttonLabel && slide.buttonUrl ? (
                    <SmartLink href={slide.buttonUrl} className={cn('mt-5 inline-flex', buttonClassName('primary'))}>
                      {slide.buttonLabel}
                    </SmartLink>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )
    case 'video': {
      const videoType = block.videoType
      const embedUrl =
        videoType === 'youtube'
          ? youtubeEmbed(block.youtubeUrl as string | undefined)
          : videoType === 'vimeo'
            ? vimeoEmbed(block.vimeoUrl as string | undefined)
            : undefined
      const uploadUrl = resolveMediaUrl(block.uploadVideo as any)
      const posterUrl = resolveMediaUrl(block.posterImage as any)

      return (
        <div {...shellProps} className={cn(shellProps.className, 'overflow-hidden rounded-[30px] border border-brand-dark/10 bg-brand-dark shadow-panel')}>
          {embedUrl ? (
            <iframe title={block.blockName as string || 'Video'} src={embedUrl} className="aspect-video w-full border-0" allowFullScreen />
          ) : uploadUrl ? (
            <video controls poster={posterUrl} className="aspect-video w-full">
              <source src={uploadUrl} />
            </video>
          ) : null}
        </div>
      )
    }
    case 'accordion':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'grid gap-4')}>
          {(Array.isArray(block.items) ? block.items : []).map((item: any, index) => (
            <details key={index} className="rounded-[24px] border border-brand-dark/10 bg-white px-6 py-5 shadow-panel">
              <summary className="cursor-pointer list-none font-heading text-xl font-semibold text-brand-dark">{item.title}</summary>
              <div className="mt-4 prose max-w-none text-brand-gunmetal">
                <RichTextContent content={item.content} />
              </div>
            </details>
          ))}
        </div>
      )
    case 'fileTable':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'overflow-hidden rounded-[28px] border border-brand-dark/10 bg-white shadow-panel')}>
          <table className="w-full border-collapse text-left">
            <thead className="bg-brand-offwhite">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-brand-dark">File</th>
                <th className="px-5 py-4 text-sm font-semibold text-brand-dark">Description</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(block.files) ? block.files : []).map((item: any, index) => {
                const url = resolveMediaUrl(item.file)
                return (
                  <tr key={index} className="border-t border-brand-dark/10">
                    <td className="px-5 py-4">
                      <SmartLink href={url} className="font-medium text-brand-blue underline-offset-4 hover:underline">
                        {item.label}
                      </SmartLink>
                    </td>
                    <td className="px-5 py-4 text-brand-gunmetal/75">{item.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    case 'testimonials': {
      let items: TestimonialDocument[]

      if (block.source === 'manual') {
        items = (Array.isArray(block.manualTestimonials) ? block.manualTestimonials : []).map(
          (item: any, index: number) => ({
            id: `manual-${index}`,
            name: item.name,
            role: item.role,
            company: item.company,
            quote: item.quote,
          }),
        ) as TestimonialDocument[]
      } else {
        // 'collection' source — use relation data populated by Payload at query depth
        items = (Array.isArray(block.testimonialItems) ? block.testimonialItems : [])
          .map(asTestimonial)
          .filter(Boolean) as TestimonialDocument[]
      }
      const displayStyle = block.displayStyle

      if (displayStyle === 'single') {
        const first = items[0]
        if (!first) return null

        return (
          <div {...shellProps} className={cn(shellProps.className, 'rounded-[34px] border border-brand-dark/10 bg-white p-10 shadow-panel')}>
            <p className="font-heading text-3xl font-semibold leading-tight text-brand-dark">“{first.quote}”</p>
            <div className="mt-8 text-brand-gunmetal/75">
              <div className="font-semibold text-brand-dark">{first.name}</div>
              <div>{[first.role, first.company].filter(Boolean).join(' · ')}</div>
            </div>
          </div>
        )
      }

      return (
        <div {...shellProps} className={cn(shellProps.className, displayStyle === 'carousel' ? 'flex gap-5 overflow-x-auto pb-2' : 'grid gap-6 md:grid-cols-3')}>
          {items.map((item) => (
            <article key={item.id} className={cn('rounded-[28px] border border-brand-dark/10 bg-white p-8 shadow-panel', displayStyle === 'carousel' && 'min-w-[320px]')}>
              <p className="text-lg leading-8 text-brand-gunmetal/88">“{item.quote}”</p>
              <div className="mt-6">
                <div className="font-heading text-xl font-semibold text-brand-dark">{item.name}</div>
                <div className="mt-1 text-sm text-brand-gunmetal/70">{[item.role, item.company].filter(Boolean).join(' · ')}</div>
              </div>
            </article>
          ))}
        </div>
      )
    }
    case 'statistics':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'grid gap-6 md:grid-cols-3')}>
          {(Array.isArray(block.stats) ? block.stats : []).map((item: any, index: number) => (
            <article key={index} className={cn('relative overflow-hidden rounded-[30px] border p-8', dark ? 'border-white/10 bg-white/8' : 'border-brand-dark/10 bg-white shadow-panel')}>
              <div className={cn('absolute inset-x-0 top-0 h-1', dark ? 'bg-gradient-to-r from-brand-green via-brand-blue to-white/20' : 'bg-gradient-to-r from-brand-blue via-sky-400 to-brand-green')} />
              <div className={cn('font-heading text-5xl font-semibold', textClass)}>{item.number}</div>
              <div className={cn('mt-3 text-xl font-medium', textClass)}>{item.label}</div>
              {item.description ? <p className={cn('mt-4 text-base leading-7', subtleClass)}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      )
    case 'feature': {
      const featureImageUrl = resolveMediaUrl(block.image as any)
      return (
        <div {...shellProps} className={cn(shellProps.className, 'feature')}>
          <div className="feature__media">
            {featureImageUrl ? (
              <Image
                src={featureImageUrl}
                alt={typeof block.title === 'string' ? block.title : ''}
                width={1200}
                height={800}
                unoptimized
                className="feature__image"
              />
            ) : null}
            {block.title ? <h3 className="feature__title">{block.title as string}</h3> : null}
          </div>
          {typeof block.text === 'string' && block.text ? (
            <div className="feature__body" dangerouslySetInnerHTML={{ __html: block.text }} />
          ) : null}
        </div>
      )
    }
    case 'cta':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'rounded-[36px] border p-10', dark ? 'border-white/10 bg-white/8 backdrop-blur' : 'border-brand-dark/10 bg-brand-dark text-white shadow-panel')}>
          {block.heading ? <h3 className={cn('font-heading text-4xl font-semibold tracking-tight', dark ? 'text-white' : 'text-white')}>{block.heading as string}</h3> : null}
          {block.text ? <p className={cn('mt-4 max-w-3xl text-lg leading-8', dark ? 'text-white/74' : 'text-white/74')}>{block.text as string}</p> : null}
          {block.buttonLabel && block.buttonUrl ? (
            <SmartLink href={block.buttonUrl as string} className={cn('mt-8 inline-flex', buttonClassName(block.style as string | undefined))}>
              {block.buttonLabel as string}
            </SmartLink>
          ) : null}
        </div>
      )
    case 'contactDetails':
      return (
        <div {...shellProps} className={cn(shellProps.className, 'rounded-[30px] border border-brand-dark/10 bg-white p-8 shadow-panel')}>
          {block.heading ? <h3 className="font-heading text-3xl font-semibold text-brand-dark">{block.heading as string}</h3> : null}
          <div className="mt-8 grid gap-7">
            {(Array.isArray(block.items) ? block.items : []).map((item: any, index: number) => {
              const Icon = resolveLucideIcon(item.icon)

              return (
                <div key={index} className="grid grid-cols-[52px_1fr] gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/8 text-brand-blue">
                    {Icon ? <Icon size={22} strokeWidth={1.8} /> : null}
                  </div>
                  <div>
                    {item.title ? <h4 className="text-xl font-semibold text-brand-dark">{item.title}</h4> : null}
                    <div className="mt-1 grid gap-1 text-base leading-7 text-brand-gunmetal/80">
                      {(Array.isArray(item.lines) ? item.lines : []).map((line: any, lineIndex: number) => (
                        line.linkUrl ? (
                          <SmartLink
                            key={`${index}-${lineIndex}`}
                            href={line.linkUrl}
                            newTab={Boolean(line.newTab)}
                            className="text-brand-blue underline-offset-4 hover:underline"
                          >
                            {line.text}
                          </SmartLink>
                        ) : (
                          <p key={`${index}-${lineIndex}`}>{line.text}</p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {block.insetPanelHeading && Array.isArray(block.insetPanelItems) && block.insetPanelItems.length ? (
            <div className="mt-8 rounded-[24px] border border-brand-blue/10 bg-brand-offwhite/70 p-6">
              <h4 className="text-2xl font-semibold text-brand-dark">{block.insetPanelHeading as string}</h4>
              <div className="mt-5 grid gap-4">
                {block.insetPanelItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-semibold text-brand-blue">
                      {index + 1}
                    </div>
                    <p className="pt-0.5 text-base leading-7 text-brand-gunmetal/80">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )
    case 'iconCard': {
      const Icon = resolveLucideIcon(block.icon)
      const leftAligned = block.layout === 'left'
      const cardClassName = cn(shellProps.className, 'icon-card', leftAligned && 'icon-card--left')
      const cardContent = (
        <>
          {Icon ? (
            <div className="icon-card__icon">
              <Icon size={40} strokeWidth={1.5} />
            </div>
          ) : null}
          {block.title ? <h3 className="icon-card__title">{block.title as string}</h3> : null}
          {block.text ? <p className="icon-card__text">{block.text as string}</p> : null}
          {block.linkLabel && block.linkUrl ? (
            <span className="icon-card__link">
              {block.linkLabel as string}
              <LucideIcons.ArrowRight size={16} strokeWidth={2} />
            </span>
          ) : null}
        </>
      )

      if (block.linkUrl) {
        return (
          <SmartLink
            href={block.linkUrl as string}
            newTab={Boolean(block.newTab)}
            className={cardClassName}
          >
            {cardContent}
          </SmartLink>
        )
      }

      return (
        <div {...shellProps} className={cardClassName}>
          {cardContent}
        </div>
      )
    }
    default:
      return null
  }
}
