/**
 * Transport-agnostic MCP tool definitions and handlers for the Atomic page builder.
 */
import path from 'path'
import type { Payload } from 'payload'

import {
  BuilderValidationError,
  collapseSections,
  expandSections,
  outlineSections,
  type CompactBlock,
  type CompactRow,
  type CompactSection,
} from './compact'
import { builderSchema, describeBlock, getBlockMap, getBuilderBlocks } from './schema'

export type ToolDefinition = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  handler: (payload: Payload, args: Record<string, any>) => Promise<unknown>
}

const object = (
  properties: Record<string, unknown>,
  required: string[] = [],
): Record<string, unknown> => ({ type: 'object', properties, required, additionalProperties: false })

const str = (description: string) => ({ type: 'string', description })
const int = (description: string) => ({ type: 'integer', description })

/** Compact section/row/column/block payloads are free-form; validation happens in compact.ts. */
const anyObject = (description: string) => ({ type: 'object', description, additionalProperties: true })

const STATUS_ENUM = {
  type: 'string',
  enum: ['draft', 'published'],
  description:
    'Publish status. Omit to keep the page as it is — edits to a published page go live, ' +
    'edits to a draft stay a draft. Pass "published" to publish, "draft" to unpublish.',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const findPage = async (payload: Payload, ref: { id?: string; slug?: string }) => {
  if (!ref.id && !ref.slug) throw new Error('Provide either `id` or `slug`')

  if (ref.id) {
    return payload.findByID({ collection: 'pages', id: ref.id, depth: 0, draft: true, overrideAccess: true })
  }

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: ref.slug } },
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
  })

  if (!result.docs[0]) throw new Error(`No page found with slug "${ref.slug}"`)
  return result.docs[0]
}

/**
 * An omitted `status` keeps the page where it already was: editing a published
 * page updates the live page, editing a draft leaves it a draft. Without this a
 * content edit on a published page would be stored as an unpublished version and
 * silently fail to appear on the site.
 */
const resolveStatus = (page: Record<string, any>, requested?: 'draft' | 'published') =>
  requested ?? (page._status === 'published' ? 'published' : 'draft')

/** Saves compact sections back onto a page. */
const savePage = async (
  payload: Payload,
  page: Record<string, any>,
  sections: CompactSection[],
  requestedStatus?: 'draft' | 'published',
) => {
  const blocks = getBlockMap(payload)
  const contentBuilder = expandSections(sections, blocks)
  const status = resolveStatus(page, requestedStatus)

  const updated = await payload.update({
    collection: 'pages',
    id: page.id,
    data: { contentBuilder, _status: status } as any,
    draft: status !== 'published',
    overrideAccess: true,
  })

  return updated
}

const summarisePage = (page: Record<string, any>) => ({
  id: page.id,
  title: page.title,
  slug: page.slug,
  status: page._status,
  updatedAt: page.updatedAt,
})

const at = <T>(list: T[], index: number, label: string): T => {
  const item = list[index]
  if (!item) {
    throw new BuilderValidationError(
      `${label}[${index}] does not exist (there are ${list.length}). Call get_page to see current indices.`,
    )
  }
  return item
}

// ---------------------------------------------------------------------------
// Structural edit operations, applied in compact space
// ---------------------------------------------------------------------------

const mergeCss = (target: Record<string, any>, patch: Record<string, any>) =>
  patch.css ? { ...target, ...patch, css: { ...(target.css ?? {}), ...patch.css } } : { ...target, ...patch }

const applyOperation = (sections: CompactSection[], op: Record<string, any>, opIndex: number) => {
  const label = `operations[${opIndex}] (${op.op})`

  const section = () => at(sections, op.section, 'section')
  const rows = () => (section().rows ??= [])
  const row = (): CompactRow => at(rows(), op.row, 'row')
  const columns = () => (row().columns ??= [])
  const column = () => {
    const list = columns()
    // Columns are implicit up to the layout's count; materialise on demand.
    while (list.length <= op.column) list.push({ blocks: [] })
    const target = at(list, op.column, 'column')
    target.blocks ??= []
    return target
  }

  const insert = <T>(list: T[], item: T, index?: number) => {
    const position = index === undefined || index < 0 || index > list.length ? list.length : index
    list.splice(position, 0, item)
  }

  switch (op.op) {
    case 'addSection':
      insert(sections, op.section as CompactSection, op.index)
      break

    case 'updateSection': {
      sections[op.section] = mergeCss(section(), op.patch) as CompactSection
      break
    }

    case 'deleteSection':
      section()
      sections.splice(op.section, 1)
      break

    case 'moveSection': {
      section()
      const [moved] = sections.splice(op.section, 1)
      insert(sections, moved, op.to)
      break
    }

    case 'addRow':
      insert(rows(), op.row as CompactRow, op.index)
      break

    case 'updateRow': {
      const list = rows()
      list[op.row] = mergeCss(row(), op.patch) as CompactRow
      break
    }

    case 'deleteRow': {
      const list = rows()
      row()
      list.splice(op.row, 1)
      break
    }

    case 'moveRow': {
      const list = rows()
      row()
      const [moved] = list.splice(op.row, 1)
      insert(list, moved, op.to)
      break
    }

    case 'updateColumn': {
      const target = column()
      Object.assign(target, mergeCss(target, op.patch))
      break
    }

    case 'addBlock':
      insert(column().blocks!, op.block as CompactBlock, op.index)
      break

    case 'updateBlock': {
      const blocks = column().blocks!
      const target = at(blocks, op.block, 'block')
      blocks[op.block] = mergeCss(target, op.patch) as CompactBlock
      break
    }

    case 'deleteBlock': {
      const blocks = column().blocks!
      at(blocks, op.block, 'block')
      blocks.splice(op.block, 1)
      break
    }

    case 'moveBlock': {
      const blocks = column().blocks!
      at(blocks, op.block, 'block')
      const [moved] = blocks.splice(op.block, 1)
      const to = op.to ?? {}
      const destSection = at(sections, to.section ?? op.section, 'section')
      const destRow = at(destSection.rows ?? [], to.row ?? op.row, 'row')
      const destColumns = (destRow.columns ??= [])
      const destIndex = to.column ?? op.column
      while (destColumns.length <= destIndex) destColumns.push({ blocks: [] })
      destColumns[destIndex].blocks ??= []
      insert(destColumns[destIndex].blocks!, moved, to.index)
      break
    }

    default:
      throw new BuilderValidationError(`${label}: unknown op "${op.op}"`)
  }
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

export const tools: ToolDefinition[] = [
  {
    name: 'get_builder_schema',
    description:
      'Returns the structure of the page builder: sections, rows, row layouts and their column counts, ' +
      'theme/padding/alignment options, and the shared CSS options available at every level. ' +
      'Call this first when building or restructuring a page.',
    inputSchema: object({}),
    handler: async (payload) => ({
      ...builderSchema(),
      availableBlockTypes: getBuilderBlocks(payload).map((block) => block.slug),
      note: 'Use list_blocks for the field schema of each block type.',
    }),
  },

  {
    name: 'list_blocks',
    description:
      'Lists the content block types available in the page builder with their editable fields. ' +
      'Pass `type` for one block in full detail.',
    inputSchema: object({
      type: str('Optional block slug, e.g. "text". Omit to list every block type.'),
    }),
    handler: async (payload, args) => {
      const blocks = getBuilderBlocks(payload)

      if (args.type) {
        const block = blocks.find((candidate) => candidate.slug === args.type)
        if (!block) {
          throw new Error(
            `Unknown block type "${args.type}". Available: ${blocks.map((b) => b.slug).join(', ')}`,
          )
        }
        return describeBlock(block, true)
      }

      return {
        commonFields: {
          name: 'Internal label for the block (stored as blockName)',
          css: 'Shared CSS object: { class, id, style, hide } — available on every block',
        },
        blocks: blocks.map((block) => describeBlock(block)),
      }
    },
  },

  {
    name: 'list_pages',
    description: 'Lists pages in the CMS with their slug, title and publish status.',
    inputSchema: object({
      search: str('Optional text to match against page titles'),
      status: STATUS_ENUM,
      limit: int('Maximum pages to return (default 50)'),
    }),
    handler: async (payload, args) => {
      const where: Record<string, unknown> = {}
      if (args.search) where.title = { like: args.search }
      if (args.status) where._status = { equals: args.status }

      const result = await payload.find({
        collection: 'pages',
        where: Object.keys(where).length ? (where as any) : undefined,
        depth: 0,
        draft: true,
        limit: args.limit ?? 50,
        overrideAccess: true,
      })

      return { total: result.totalDocs, pages: result.docs.map(summarisePage) }
    },
  },

  {
    name: 'get_page',
    description:
      'Reads a page. `format: "outline"` (default) gives a compact indexed tree — use it to find the ' +
      'section/row/column/block indices that edit_page takes. `format: "compact"` returns the full ' +
      'editable content in the compact authoring format. `format: "raw"` returns the underlying Payload document.',
    inputSchema: object({
      id: str('Page id'),
      slug: str('Page slug, e.g. "home" (alternative to id)'),
      format: { type: 'string', enum: ['outline', 'compact', 'raw'], description: 'Output format' },
    }),
    handler: async (payload, args) => {
      const page = await findPage(payload, args)

      if (args.format === 'raw') return page

      const sections = collapseSections((page as any).contentBuilder)
      const meta = { ...summarisePage(page as any), seo: (page as any).seo, excerpt: (page as any).excerpt }

      if (args.format === 'compact') return { ...meta, sections }

      return { ...meta, outline: outlineSections(sections) }
    },
  },

  {
    name: 'create_page',
    description:
      'Creates a new page. Provide `sections` in the compact builder format (see get_builder_schema ' +
      'and list_blocks). Defaults to draft unless status is "published".',
    inputSchema: object(
      {
        title: str('Page title'),
        slug: str('URL slug. Derived from the title when omitted. Use "home" for the homepage.'),
        excerpt: str('Short summary of the page'),
        sections: {
          type: 'array',
          description: 'Page content in the compact builder format',
          items: anyObject('A section: { name, theme?, padding?, rows: [{ layout, columns: [{ blocks: [...] }] }] }'),
        },
        seo: anyObject('SEO group: { title, description, canonicalUrl, noIndex, noFollow, schemaType }'),
        status: STATUS_ENUM,
      },
      ['title', 'sections'],
    ),
    handler: async (payload, args) => {
      const blocks = getBlockMap(payload)
      const contentBuilder = expandSections(args.sections, blocks)
      const status = args.status ?? 'draft'

      const page = await payload.create({
        collection: 'pages',
        data: {
          title: args.title,
          ...(args.slug ? { slug: args.slug } : {}),
          ...(args.excerpt ? { excerpt: args.excerpt } : {}),
          ...(args.seo ? { seo: args.seo } : {}),
          contentBuilder,
          _status: status,
        } as any,
        draft: status !== 'published',
        overrideAccess: true,
      })

      return { created: summarisePage(page as any) }
    },
  },

  {
    name: 'update_page',
    description:
      'Updates page metadata — title, slug, excerpt, SEO — and/or publish status. ' +
      'Use set_page_content or edit_page to change the page content itself.',
    inputSchema: object({
      id: str('Page id'),
      slug: str('Current page slug (alternative to id)'),
      title: str('New title'),
      newSlug: str('New slug'),
      excerpt: str('New excerpt'),
      seo: anyObject('SEO group fields to set'),
      status: STATUS_ENUM,
    }),
    handler: async (payload, args) => {
      const page = await findPage(payload, args)
      const data: Record<string, unknown> = {}

      if (args.title !== undefined) data.title = args.title
      if (args.newSlug !== undefined) data.slug = args.newSlug
      if (args.excerpt !== undefined) data.excerpt = args.excerpt
      if (args.seo !== undefined) data.seo = { ...((page as any).seo ?? {}), ...args.seo }

      if (!Object.keys(data).length && args.status === undefined) {
        throw new Error('No fields supplied to update')
      }

      const status = resolveStatus(page as any, args.status)
      data._status = status

      const updated = await payload.update({
        collection: 'pages',
        id: (page as any).id,
        data: data as any,
        draft: status !== 'published',
        overrideAccess: true,
      })

      return { updated: summarisePage(updated as any) }
    },
  },

  {
    name: 'set_page_content',
    description:
      'Replaces the entire content of a page with the supplied compact sections. ' +
      'Use this for a full rebuild; use edit_page for targeted changes.',
    inputSchema: object(
      {
        id: str('Page id'),
        slug: str('Page slug (alternative to id)'),
        sections: {
          type: 'array',
          description: 'The complete new page content in the compact builder format',
          items: anyObject('A section'),
        },
        status: STATUS_ENUM,
      },
      ['sections'],
    ),
    handler: async (payload, args) => {
      const page = await findPage(payload, args)
      const updated = await savePage(payload, page as any, args.sections, args.status)
      const sections = collapseSections((updated as any).contentBuilder)

      return { updated: summarisePage(updated as any), outline: outlineSections(sections) }
    },
  },

  {
    name: 'edit_page',
    description:
      'Applies targeted structural edits to a page. Operations run in order against the current content ' +
      'and are saved as one atomic update, so batch related changes into a single call. ' +
      'Indices come from get_page. Because each op shifts later indices, prefer descending index order ' +
      'when deleting several items.\n\n' +
      'Ops: addSection{section,index?} updateSection{section,patch} deleteSection{section} moveSection{section,to} ' +
      'addRow{section,row,index?} updateRow{section,row,patch} deleteRow{section,row} moveRow{section,row,to} ' +
      'updateColumn{section,row,column,patch} addBlock{section,row,column,block,index?} ' +
      'updateBlock{section,row,column,block,patch} deleteBlock{section,row,column,block} ' +
      'moveBlock{section,row,column,block,to:{section?,row?,column?,index?}}\n\n' +
      'Note: for addSection/addRow/addBlock the `section`/`row`/`block` value is the new object; ' +
      'elsewhere it is a zero-based index. `patch` merges into the existing object (css merges key by key).',
    inputSchema: object(
      {
        id: str('Page id'),
        slug: str('Page slug (alternative to id)'),
        operations: {
          type: 'array',
          minItems: 1,
          description: 'Ordered list of edit operations',
          items: anyObject('An operation — see the tool description for the shape of each op'),
        },
        status: STATUS_ENUM,
      },
      ['operations'],
    ),
    handler: async (payload, args) => {
      const page = await findPage(payload, args)
      const sections = collapseSections((page as any).contentBuilder)

      args.operations.forEach((op: Record<string, any>, index: number) => {
        applyOperation(sections, op, index)
      })

      const updated = await savePage(payload, page as any, sections, args.status)
      const saved = collapseSections((updated as any).contentBuilder)

      return {
        updated: summarisePage(updated as any),
        applied: args.operations.length,
        outline: outlineSections(saved),
      }
    },
  },

  {
    name: 'delete_page',
    description: 'Permanently deletes a page. This cannot be undone.',
    inputSchema: object({
      id: str('Page id'),
      slug: str('Page slug (alternative to id)'),
    }),
    handler: async (payload, args) => {
      const page = await findPage(payload, args)
      await payload.delete({ collection: 'pages', id: (page as any).id, overrideAccess: true })
      return { deleted: summarisePage(page as any) }
    },
  },

  {
    name: 'list_media',
    description:
      'Lists media documents. Use the returned ids for image/upload fields such as a block image or a ' +
      'section background.',
    inputSchema: object({
      search: str('Optional text to match against filename or alt text'),
      limit: int('Maximum results (default 50)'),
    }),
    handler: async (payload, args) => {
      const result = await payload.find({
        collection: 'media',
        where: args.search
          ? { or: [{ filename: { like: args.search } }, { alt: { like: args.search } }] }
          : undefined,
        depth: 0,
        limit: args.limit ?? 50,
        overrideAccess: true,
      })

      return {
        total: result.totalDocs,
        media: result.docs.map((doc: any) => ({
          id: doc.id,
          filename: doc.filename,
          alt: doc.alt,
          mimeType: doc.mimeType,
          width: doc.width,
          height: doc.height,
          url: doc.url,
        })),
      }
    },
  },

  {
    name: 'upload_media',
    description:
      'Uploads an image or document into the media library from a local file path or a URL, and returns ' +
      'its id for use in blocks and section backgrounds.',
    inputSchema: object(
      {
        filePath: str('Absolute path to a local file'),
        url: str('URL to download the file from (alternative to filePath)'),
        alt: str('Alt text — required by the media library'),
        caption: str('Optional caption'),
        filename: str('Override the stored filename (applies to `url` downloads)'),
      },
      ['alt'],
    ),
    handler: async (payload, args) => {
      if (!args.filePath && !args.url) throw new Error('Provide either `filePath` or `url`')

      const data = { alt: args.alt, ...(args.caption ? { caption: args.caption } : {}) } as any

      let created
      if (args.filePath) {
        // Let Payload read the file so it detects the mime type itself — the media
        // collection restricts mimeTypes, so guessing here would fail validation.
        created = await payload.create({
          collection: 'media',
          data,
          filePath: path.resolve(args.filePath),
          overrideAccess: true,
        })
      } else {
        const response = await fetch(args.url)
        if (!response.ok) throw new Error(`Failed to download ${args.url}: ${response.status}`)

        const buffer = Buffer.from(await response.arrayBuffer())
        created = await payload.create({
          collection: 'media',
          data,
          file: {
            data: buffer,
            name: args.filename ?? (path.basename(new URL(args.url).pathname) || 'upload'),
            mimetype: response.headers.get('content-type') ?? '',
            size: buffer.byteLength,
          },
          overrideAccess: true,
        })
      }

      return {
        uploaded: {
          id: (created as any).id,
          filename: (created as any).filename,
          url: (created as any).url,
        },
      }
    },
  },

  {
    name: 'get_site_settings',
    description:
      'Reads site-wide settings: branding, navigation, contact details, global custom CSS, analytics and default SEO.',
    inputSchema: object({}),
    handler: async (payload) => {
      const result = await payload.find({ collection: 'site-settings', depth: 0, limit: 1, overrideAccess: true })
      if (!result.docs[0]) throw new Error('Site settings have not been created yet')
      return result.docs[0]
    },
  },

  {
    name: 'update_site_settings',
    description:
      'Updates site-wide settings. `globalCustomCss` is injected on every page, which is where site-wide ' +
      'styling belongs — per-page styling should use the css options on sections, rows, columns and blocks.',
    inputSchema: object({
      siteName: str('Site name'),
      siteTagline: str('Site tagline'),
      globalCustomCss: str('CSS applied site-wide'),
      announcement: str('Announcement bar text'),
      email: str('Contact email'),
      phone: str('Contact phone'),
      address: str('Contact address'),
      ga4MeasurementId: str('Google Analytics 4 measurement id'),
      googleAdsId: str('Google Ads tag id (AW-XXXXXXXXX)'),
      googleAdsConversionEvent: str('Google Ads conversion event name fired on contact form submit'),
      primaryNavigation: {
        type: 'array',
        description: 'Primary nav items, replaces the existing list',
        items: object({ label: str('Link label'), slug: str('Target slug') }, ['label', 'slug']),
      },
      footerNavigation: {
        type: 'array',
        description: 'Footer nav items, replaces the existing list',
        items: object({ label: str('Link label'), slug: str('Target slug') }, ['label', 'slug']),
      },
      seo: anyObject('Default SEO group fields'),
    }),
    handler: async (payload, args) => {
      const result = await payload.find({ collection: 'site-settings', depth: 0, limit: 1, overrideAccess: true })
      const existing = result.docs[0]
      if (!existing) throw new Error('Site settings have not been created yet')

      const data = Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined))
      if (!Object.keys(data).length) throw new Error('No fields supplied to update')

      const updated = await payload.update({
        collection: 'site-settings',
        id: (existing as any).id,
        data: data as any,
        overrideAccess: true,
      })

      return { updated: Object.keys(data) , siteName: (updated as any).siteName }
    },
  },
]

export const toolMap = new Map(tools.map((tool) => [tool.name, tool]))
