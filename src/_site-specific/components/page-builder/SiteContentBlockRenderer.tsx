import Image from 'next/image'

import type { BuilderContentBase } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ContentBlockRenderer } from '@/components/page-builder/content-block-renderer'
import {
  buildInlineStyle,
  buttonClassName,
  SmartLink,
  wrapperClassName,
} from '@/components/page-builder/helpers'
import { getProjects } from '@/_site-specific/lib/content'
import type { ProjectDocument } from '@/_site-specific/lib/types'

const asProject = (value: unknown): ProjectDocument | null =>
  value && typeof value === 'object' && 'slug' in value ? (value as ProjectDocument) : null

export const SiteContentBlockRenderer = async ({
  block,
  theme,
}: {
  block: BuilderContentBase
  theme?: string
}) => {
  const shellClass = cn(
    wrapperClassName(block),
    block.blockType !== 'text' && block.blockType !== 'buttons' && 'rounded-[28px]',
  )
  const shellProps = {
    id: block.customCssId || undefined,
    className: shellClass,
    style: buildInlineStyle(block),
  }

  switch (block.blockType) {
    case 'projectCards': {
      let items: ProjectDocument[] = []

      if (block.source === 'manual') {
        items =
          ((Array.isArray(block.projects) ? block.projects : [])
            .map(asProject)
            .filter(Boolean) as ProjectDocument[]) || []
      } else if (block.source === 'latest') {
        items = await getProjects({ limit: Number(block.limit) || 3 })
      } else {
        items = await getProjects({ featured: true, limit: Number(block.limit) || 3 })
      }

      return (
        <div
          {...shellProps}
          className={cn(
            shellProps.className,
            block.displayStyle === 'carousel'
              ? 'flex gap-5 overflow-x-auto pb-2'
              : 'grid gap-6 md:grid-cols-3',
          )}
        >
          {items.map((project) => (
            <article
              key={project.id}
              className={cn(
                'rounded-[30px] border border-brand-dark/10 bg-white p-8 shadow-panel',
                block.displayStyle === 'carousel' && 'min-w-[320px]',
              )}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="rounded-full bg-brand-blue/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  {project.industry || 'Project'}
                </span>
                <span className="text-sm text-brand-gunmetal/65">{project.client}</span>
              </div>
              <h3 className="font-heading text-3xl font-semibold text-brand-dark">{project.title}</h3>
              <p className="mt-4 text-base leading-7 text-brand-gunmetal/82">{project.summary}</p>
              <SmartLink
                href={`/projects/${project.slug}`}
                className={cn('mt-8 inline-flex', buttonClassName('text'))}
              >
                View project
              </SmartLink>
            </article>
          ))}
        </div>
      )
    }

    case 'bookingSearchForm':
      return (
        <div
          {...shellProps}
          className={cn(
            shellProps.className,
            'rounded-[32px] border border-brand-dark/10 bg-white p-8 shadow-panel',
          )}
        >
          {block.heading ? (
            <h3 className="font-heading text-3xl font-semibold text-brand-dark">
              {block.heading as string}
            </h3>
          ) : null}
          {block.subheading ? (
            <p className="mt-3 text-base leading-7 text-brand-gunmetal/78">
              {block.subheading as string}
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <input
              className="rounded-2xl border border-brand-dark/10 px-4 py-3"
              placeholder="Destination"
            />
            <input
              className="rounded-2xl border border-brand-dark/10 px-4 py-3"
              placeholder="Dates"
            />
            <input
              className="rounded-2xl border border-brand-dark/10 px-4 py-3"
              placeholder="Guests"
            />
          </div>
          <SmartLink
            href={block.destinationUrl as string | undefined}
            className={cn('mt-6 inline-flex', buttonClassName('primary'))}
          >
            {(block.buttonText as string) || 'Search'}
          </SmartLink>
        </div>
      )

    default:
      return <ContentBlockRenderer block={block} theme={theme} />
  }
}
