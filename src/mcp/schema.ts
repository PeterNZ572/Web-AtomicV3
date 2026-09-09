/**
 * Introspects the live Payload config so the MCP tools always describe the real
 * builder schema — including any site-specific blocks added through the plugin.
 */
import type { Block, Field, Payload, SanitizedCollectionConfig } from 'payload'

import {
  backgroundPositionOptions,
  backgroundRepeatOptions,
  backgroundSizeOptions,
  getColumnCount,
  hideOptions,
  paddingLevelOptions,
  rowLayoutOptions,
  sectionThemeOptions,
  verticalAlignmentOptions,
  yesNoOptions,
} from '../lib/builder-config'

export type FieldSchema = {
  name: string
  type: string
  label?: string
  required?: boolean
  defaultValue?: unknown
  options?: string[]
  relationTo?: string
  description?: string
  fields?: FieldSchema[]
}

/** Fields every content block carries — documented once instead of on all 18 blocks. */
export const COMMON_BLOCK_FIELDS = ['blockName', 'customCssClass', 'customCssId', 'customInlineStyle', 'hide']

const isPresentational = (field: Field): boolean =>
  field.type === 'row' || field.type === 'collapsible' || field.type === 'tabs' || field.type === 'ui'

/** Payload nests data fields inside layout-only wrappers; flatten those away. */
const flattenFields = (fields: Field[]): Field[] =>
  fields.flatMap((field) => {
    if (field.type === 'tabs') {
      return flattenFields(field.tabs.flatMap((tab) => ('fields' in tab ? tab.fields : [])))
    }
    if (isPresentational(field) && 'fields' in field && Array.isArray(field.fields)) {
      return flattenFields(field.fields as Field[])
    }
    return [field]
  })

const optionValues = (field: Field): string[] | undefined => {
  if (!('options' in field) || !Array.isArray(field.options)) return undefined
  return field.options.map((option) =>
    typeof option === 'string' ? option : String(option.value),
  )
}

/**
 * Payload injects a hidden auto-generated `id` into every block and array row.
 * It is not something a caller should ever set, so keep it out of the schema.
 */
const isHidden = (field: Field): boolean =>
  (field.admin as { hidden?: boolean } | undefined)?.hidden === true ||
  ('hidden' in field && field.hidden === true)

export const describeField = (field: Field): FieldSchema | null => {
  if (!('name' in field) || !field.name) return null
  if (isHidden(field)) return null

  const schema: FieldSchema = { name: field.name, type: field.type }

  const label = 'label' in field ? field.label : undefined
  if (typeof label === 'string' && label) schema.label = label
  if ('required' in field && field.required) schema.required = true
  if ('defaultValue' in field && field.defaultValue !== undefined && typeof field.defaultValue !== 'function') {
    schema.defaultValue = field.defaultValue as unknown
  }

  const options = optionValues(field)
  if (options) schema.options = options

  if ('relationTo' in field && typeof field.relationTo === 'string') {
    schema.relationTo = field.relationTo
  }

  const description = (field.admin as { description?: unknown } | undefined)?.description
  if (typeof description === 'string' && description) schema.description = description

  if ((field.type === 'array' || field.type === 'group') && 'fields' in field) {
    schema.fields = describeFields(field.fields as Field[])
  }

  return schema
}

export const describeFields = (fields: Field[]): FieldSchema[] => {
  const described = flattenFields(fields)
    .map(describeField)
    .filter((schema): schema is FieldSchema => schema !== null)

  // Payload also injects `blockName` into blocks that already declare it, so the
  // sanitized field list can contain duplicates. Keep the first of each name.
  const seen = new Set<string>()
  return described.filter((schema) => {
    if (seen.has(schema.name)) return false
    seen.add(schema.name)
    return true
  })
}

export type BlockSchema = {
  type: string
  label: string
  fields: FieldSchema[]
}

export const describeBlock = (block: Block, includeCommon = false): BlockSchema => {
  const singular = block.labels?.singular
  const fields = describeFields(block.fields).filter(
    (field) => includeCommon || !COMMON_BLOCK_FIELDS.includes(field.name),
  )

  return {
    type: block.slug,
    label: typeof singular === 'string' ? singular : block.slug,
    fields,
  }
}

/**
 * Walks a collection's fields to find the builder's `contentBlocks` blocks field.
 * Reading it from the sanitized config (rather than importing `contentBlocks`)
 * guarantees parity with what the admin builder actually accepts.
 */
const findContentBlocks = (fields: Field[]): Block[] | null => {
  for (const field of fields) {
    if (field.type === 'blocks' && 'name' in field && field.name === 'contentBlocks') {
      return field.blocks as Block[]
    }

    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab) {
          const found = findContentBlocks(tab.fields)
          if (found) return found
        }
      }
      continue
    }

    if ('fields' in field && Array.isArray(field.fields)) {
      const found = findContentBlocks(field.fields as Field[])
      if (found) return found
    }
  }

  return null
}

export const getBuilderBlocks = (payload: Payload): Block[] => {
  const pages = payload.config.collections.find(
    (collection: SanitizedCollectionConfig) => collection.slug === 'pages',
  )

  if (!pages) throw new Error('Pages collection not found in the Payload config')

  const blocks = findContentBlocks(pages.fields)
  if (!blocks) throw new Error('contentBlocks field not found on the Pages collection')

  return blocks
}

export const getBlockMap = (payload: Payload): Map<string, Block> =>
  new Map(getBuilderBlocks(payload).map((block) => [block.slug, block]))

const values = (options: readonly { value: string }[]) => options.map((option) => option.value)

/** The section / row / column layer of the builder, which is fixed rather than block-driven. */
export const builderSchema = () => ({
  structure:
    'A page is contentBuilder: Section[] -> rows: Row[] -> columns (1-4, determined by the row layout) -> blocks: Block[].',
  section: {
    name: 'string (required) — internal label for the section',
    theme: values(sectionThemeOptions),
    verticalAlignment: values(verticalAlignmentOptions),
    padding: values(paddingLevelOptions),
    fullWidth: values(yesNoOptions),
    background: {
      image: 'media document id (use list_media or upload_media to obtain one)',
      repeat: values(backgroundRepeatOptions),
      size: values(backgroundSizeOptions),
      position: values(backgroundPositionOptions),
    },
    css: 'shared css object — see `css` below',
    rows: 'Row[] (at least one)',
  },
  row: {
    name: 'string — internal label',
    layout: values(rowLayoutOptions),
    css: 'shared css object',
    columns: 'Column[] — length must not exceed the column count of the chosen layout',
  },
  column: {
    name: 'string — internal label',
    css: 'shared css object',
    blocks: 'Block[] — each needs a `type` from list_blocks plus that block\'s fields',
  },
  css: {
    class: 'string — space separated CSS classes',
    id: 'string — CSS id',
    style: 'string — inline CSS, e.g. "border-radius: 25px; gap: 2rem;"',
    hide: values(hideOptions),
  },
  columnCountsByLayout: Object.fromEntries(
    rowLayoutOptions.map((option) => [option.value, getColumnCount(option.value)]),
  ),
})
