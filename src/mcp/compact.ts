/**
 * Translation between the verbose Payload contentBuilder shape and a compact
 * authoring format that is practical for an AI to read and write.
 *
 * Compact:  { name, theme, rows: [{ layout, columns: [{ blocks: [...] }] }] }
 * Payload:  { sectionName, themeStyle, rows: [{ rowLayout, column1: { contentBlocks: [...] } }] }
 */
import type { Block } from 'payload'

import { getColumnCount, rowLayoutOptions } from '../lib/builder-config'
import { COMMON_BLOCK_FIELDS, describeBlock } from './schema'

export type CompactCss = {
  class?: string
  id?: string
  style?: string
  hide?: string
}

export type CompactBlock = { type: string; name?: string; css?: CompactCss } & Record<string, unknown>

export type CompactColumn = {
  name?: string
  css?: CompactCss
  blocks?: CompactBlock[]
}

export type CompactRow = {
  name?: string
  layout?: string
  css?: CompactCss
  columns?: CompactColumn[]
}

export type CompactSection = {
  name: string
  theme?: string
  verticalAlignment?: string
  padding?: string
  fullWidth?: string
  background?: {
    image?: string
    repeat?: string
    size?: string
    position?: string
  }
  css?: CompactCss
  rows?: CompactRow[]
}

const MAX_COLUMNS = 4
const layoutValues = new Set(rowLayoutOptions.map((option) => option.value as string))

export class BuilderValidationError extends Error {}

const fail = (path: string, message: string): never => {
  throw new BuilderValidationError(`${path}: ${message}`)
}

/** Drops undefined/null so Payload keeps its own defaults rather than storing empties. */
const defined = <T extends Record<string, unknown>>(input: T): Record<string, unknown> =>
  Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined && value !== null))

const expandCss = (css?: CompactCss) =>
  defined({
    customCssClass: css?.class,
    customCssId: css?.id,
    customInlineStyle: css?.style,
    hide: css?.hide,
  })

const collapseCss = (source: Record<string, unknown>): CompactCss | undefined => {
  const css = defined({
    class: source.customCssClass,
    id: source.customCssId,
    style: source.customInlineStyle,
    // `hide: 'no'` is the default and just adds noise when reading a page back.
    hide: source.hide === 'no' ? undefined : source.hide,
  }) as CompactCss

  return Object.keys(css).length ? css : undefined
}

/** Media uploads may come back as an object (depth > 0) or a bare id. */
const relationId = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    return String((value as { id: unknown }).id)
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Compact -> Payload
// ---------------------------------------------------------------------------

const expandBlock = (block: CompactBlock, blocks: Map<string, Block>, path: string) => {
  if (!block || typeof block !== 'object') fail(path, 'block must be an object')
  if (!block.type) fail(path, 'block is missing `type` (see list_blocks)')

  const definition = blocks.get(block.type)
  if (!definition) {
    fail(path, `unknown block type "${block.type}". Available: ${[...blocks.keys()].join(', ')}`)
  }

  const { type, name, css, ...fields } = block
  const known = new Set([
    ...describeBlock(definition!, true).fields.map((field) => field.name),
    ...COMMON_BLOCK_FIELDS,
  ])

  const unknownFields = Object.keys(fields).filter((key) => !known.has(key))
  if (unknownFields.length) {
    fail(
      path,
      `block "${type}" has no field(s): ${unknownFields.join(', ')}. Valid fields: ${[...known].join(', ')}`,
    )
  }

  return {
    blockType: type,
    ...defined({ blockName: name }),
    ...expandCss(css),
    ...fields,
  }
}

const expandColumn = (column: CompactColumn, blocks: Map<string, Block>, path: string) => ({
  ...defined({ columnName: column.name }),
  ...expandCss(column.css),
  contentBlocks: (column.blocks ?? []).map((block, index) =>
    expandBlock(block, blocks, `${path}.blocks[${index}]`),
  ),
})

const expandRow = (row: CompactRow, blocks: Map<string, Block>, path: string) => {
  const layout = row.layout ?? 'full'
  if (!layoutValues.has(layout)) {
    fail(path, `unknown layout "${layout}". Available: ${[...layoutValues].join(', ')}`)
  }

  const columns = row.columns ?? []
  const allowed = getColumnCount(layout)
  if (columns.length > allowed) {
    fail(
      path,
      `layout "${layout}" has ${allowed} column(s) but ${columns.length} were supplied. ` +
        'Pick a layout with more columns or move the content into fewer columns.',
    )
  }

  const expanded: Record<string, unknown> = {
    ...defined({ rowName: row.name }),
    rowLayout: layout,
    ...expandCss(row.css),
  }

  // Payload models the areas as discrete column1..column4 groups, not an array.
  // Only write the slots this layout actually uses: the renderer emits a wrapper
  // for every non-empty slot, and a stray one still consumes a grid gap.
  for (let index = 0; index < MAX_COLUMNS; index += 1) {
    const column = columns[index]

    if (index >= allowed) {
      continue
    }

    expanded[`column${index + 1}`] = column
      ? expandColumn(column, blocks, `${path}.columns[${index}]`)
      : { contentBlocks: [] }
  }

  return expanded
}

export const expandSection = (section: CompactSection, blocks: Map<string, Block>, path: string) => {
  if (!section || typeof section !== 'object') fail(path, 'section must be an object')
  if (!section.name) fail(path, 'section is missing `name`')

  const rows = section.rows ?? []
  if (!rows.length) fail(path, 'section needs at least one row')

  return {
    sectionName: section.name,
    ...defined({
      themeStyle: section.theme,
      verticalAlignment: section.verticalAlignment,
      paddingLevel: section.padding,
      fullWidth: section.fullWidth,
      customBackgroundImage: section.background?.image,
      backgroundRepeat: section.background?.repeat,
      backgroundSize: section.background?.size,
      backgroundPosition: section.background?.position,
    }),
    ...expandCss(section.css),
    rows: rows.map((row, index) => expandRow(row, blocks, `${path}.rows[${index}]`)),
  }
}

export const expandSections = (sections: CompactSection[], blocks: Map<string, Block>) => {
  if (!Array.isArray(sections) || !sections.length) {
    throw new BuilderValidationError('sections must be a non-empty array')
  }

  return sections.map((section, index) => expandSection(section, blocks, `sections[${index}]`))
}

// ---------------------------------------------------------------------------
// Payload -> Compact
// ---------------------------------------------------------------------------

const collapseBlock = (block: Record<string, unknown>): CompactBlock => {
  const { blockType, blockName, id, customCssClass, customCssId, customInlineStyle, hide, ...fields } =
    block

  const compact: CompactBlock = { type: String(blockType) }
  if (blockName) compact.name = String(blockName)

  const css = collapseCss({ customCssClass, customCssId, customInlineStyle, hide })
  if (css) compact.css = css

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue
    compact[key] = relationId(value) && typeof value === 'object' ? relationId(value) : value
  }

  return compact
}

const collapseColumn = (column: Record<string, unknown> | undefined): CompactColumn | null => {
  if (!column) return null

  const contentBlocks = (column.contentBlocks as Record<string, unknown>[] | undefined) ?? []
  const css = collapseCss(column)
  const name = column.columnName

  if (!contentBlocks.length && !css && !name) return null

  return {
    ...defined({ name }),
    ...(css ? { css } : {}),
    blocks: contentBlocks.map(collapseBlock),
  }
}

const collapseRow = (row: Record<string, unknown>): CompactRow => {
  const columns: CompactColumn[] = []
  const count = getColumnCount(row.rowLayout as string)

  for (let index = 0; index < count; index += 1) {
    const column = collapseColumn(row[`column${index + 1}`] as Record<string, unknown> | undefined)
    columns.push(column ?? { blocks: [] })
  }

  const css = collapseCss(row)

  return {
    ...defined({ name: row.rowName }),
    layout: (row.rowLayout as string) ?? 'full',
    ...(css ? { css } : {}),
    columns,
  }
}

export const collapseSection = (section: Record<string, unknown>): CompactSection => {
  const background = defined({
    image: relationId(section.customBackgroundImage),
    repeat: section.backgroundRepeat,
    size: section.backgroundSize,
    position: section.backgroundPosition,
  })

  const css = collapseCss(section)

  return {
    name: String(section.sectionName ?? ''),
    ...defined({
      theme: section.themeStyle,
      verticalAlignment: section.verticalAlignment,
      padding: section.paddingLevel,
      fullWidth: section.fullWidth,
    }),
    ...(background.image ? { background } : {}),
    ...(css ? { css } : {}),
    rows: ((section.rows as Record<string, unknown>[] | undefined) ?? []).map(collapseRow),
  }
}

export const collapseSections = (sections: unknown): CompactSection[] =>
  Array.isArray(sections) ? sections.map((section) => collapseSection(section)) : []

// ---------------------------------------------------------------------------
// Outline — a token-cheap map of a page, with the indices the edit ops take
// ---------------------------------------------------------------------------

const summariseBlock = (block: CompactBlock): string => {
  const { type, name, css, ...fields } = block

  if (type === 'text' && typeof fields.content === 'string') {
    const text = fields.content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return `text "${text.length > 60 ? `${text.slice(0, 60)}…` : text}"`
  }

  const hint = name ? ` "${name}"` : ''
  const keys = Object.keys(fields)
  return `${type}${hint}${keys.length ? ` (${keys.join(', ')})` : ''}`
}

export const outlineSections = (sections: CompactSection[]): string => {
  if (!sections.length) return '(no sections)'

  const lines: string[] = []

  sections.forEach((section, sectionIndex) => {
    const meta = [section.theme, section.padding && `padding:${section.padding}`, section.fullWidth === 'yes' && 'full-width']
      .filter(Boolean)
      .join(', ')

    lines.push(`section[${sectionIndex}] "${section.name}"${meta ? ` — ${meta}` : ''}`)

    ;(section.rows ?? []).forEach((row, rowIndex) => {
      lines.push(`  row[${rowIndex}] layout:${row.layout}${row.name ? ` "${row.name}"` : ''}`)

      ;(row.columns ?? []).forEach((column, columnIndex) => {
        const blocks = column.blocks ?? []
        lines.push(
          `    column[${columnIndex}]${column.name ? ` "${column.name}"` : ''} — ${blocks.length} block(s)`,
        )
        blocks.forEach((block, blockIndex) => {
          lines.push(`      block[${blockIndex}] ${summariseBlock(block)}`)
        })
      })
    })
  })

  return lines.join('\n')
}
