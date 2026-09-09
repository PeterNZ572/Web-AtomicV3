import type { Block, Field } from 'payload'

import { contentBlocks } from '../blocks'
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

const showColumn = (columnIndex: number) => (_: unknown, siblingData?: { rowLayout?: string }) =>
  getColumnCount(siblingData?.rowLayout) >= columnIndex

const sharedCssFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'customCssClass',
        label: 'Custom CSS Class',
        type: 'text',
        admin: {
          description: 'Allow multiple classes separated by spaces.',
        },
      },
      {
        name: 'customCssId',
        label: 'Custom CSS ID',
        type: 'text',
      },
    ],
  },
  {
    name: 'customInlineStyle',
    label: 'Custom Inline Style',
    type: 'textarea',
  },
  {
    name: 'hide',
    type: 'select',
    defaultValue: 'no',
    options: [...hideOptions],
  },
]

const advancedCssFields = (className: string): Field => ({
  type: 'collapsible',
  label: 'Advanced',
  admin: {
    className,
    initCollapsed: true,
    description: 'Technical styling and visibility controls.',
  },
  fields: [...sharedCssFields()],
})

const makeColumnField = (name: string, label: string, blocks: Block[], columnIndex = 1): Field => ({
  name,
  label,
  type: 'group',
  admin: {
    className: `atomic-builder__column atomic-builder__column--${columnIndex}`,
    condition: columnIndex === 1 ? undefined : showColumn(columnIndex),
    description: `Visual layout area ${columnIndex}.`,
    components: {
      Label: './app/(payload)/components/admin/AreaLabel.tsx#AreaLabel',
    },
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Area Settings',
      admin: {
        className: 'atomic-builder__settings atomic-builder__settings--column',
        initCollapsed: true,
      },
      fields: [
        { name: 'columnName', label: 'Column Name', type: 'text' },
        ...sharedCssFields(),
      ],
    },
    {
      name: 'contentBlocks',
      label: 'Area Content',
      type: 'blocks',
      blocks,
      required: false,
      admin: {
        className: `atomic-builder__blocks atomic-builder__blocks--area atomic-builder__blocks--area-${columnIndex}`,
        components: {
          Field: './app/(payload)/components/admin/AtomicBlocksField.tsx#AtomicBlocksField',
        },
      },
    },
  ],
})

const makeRowField = (blocks: Block[]): Field => ({
  name: 'rows',
  label: 'Rows',
  type: 'array',
  minRows: 1,
  admin: {
    className: 'atomic-builder__rows',
    initCollapsed: true,
    components: {
      RowLabel: './app/(payload)/components/admin/BuilderRowLabel.tsx#BuilderRowLabel',
    },
    description: 'Each section contains one or more rows. Choose a layout, then add content into each generated column.',
  },
  fields: [
    { name: 'rowName', label: 'Row Name', type: 'text' },
    {
      type: 'collapsible',
      label: 'Row Settings',
      admin: {
        className: 'atomic-builder__settings atomic-builder__settings--row',
      },
      fields: [
        {
          name: 'rowLayout',
          label: 'Row Layout',
          type: 'select',
          required: true,
          defaultValue: 'full',
          options: [...rowLayoutOptions],
        },
        advancedCssFields('atomic-builder__settings atomic-builder__settings--row-advanced'),
      ],
    },
    makeColumnField('column1', 'Area 1', blocks, 1),
    makeColumnField('column2', 'Area 2', blocks, 2),
    makeColumnField('column3', 'Area 3', blocks, 3),
    makeColumnField('column4', 'Area 4', blocks, 4),
  ],
})

export const createContentBuilderField = (blocks: Block[]): Field => ({
  name: 'contentBuilder',
  label: 'Content Builder',
  type: 'array',
  required: true,
  minRows: 1,
  admin: {
    className: 'atomic-builder',
    initCollapsed: true,
    components: {
      RowLabel: './app/(payload)/components/admin/SectionRowLabel.tsx#SectionRowLabel',
    },
    description: 'Build pages using sections, rows, columns, and content blocks.',
  },
  fields: [
    { name: 'sectionName', label: 'Section Name', type: 'text', required: true },
    {
      type: 'collapsible',
      label: 'Section Settings',
      admin: {
        className: 'atomic-builder__settings atomic-builder__settings--section',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'themeStyle',
              label: 'Theme Style',
              type: 'select',
              defaultValue: 'default',
              options: [...sectionThemeOptions],
            },
            {
              name: 'verticalAlignment',
              label: 'Vertical Alignment',
              type: 'select',
              defaultValue: 'top',
              options: [...verticalAlignmentOptions],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'paddingLevel',
              label: 'Padding Level',
              type: 'select',
              defaultValue: 'level4',
              options: [...paddingLevelOptions],
            },
            {
              name: 'fullWidth',
              label: 'Full Width',
              type: 'select',
              defaultValue: 'no',
              options: [...yesNoOptions],
            },
          ],
        },
        advancedCssFields('atomic-builder__settings atomic-builder__settings--section-advanced'),
        {
          name: 'customBackgroundImage',
          label: 'Custom Background Image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundRepeat',
              label: 'Background Repeat',
              type: 'select',
              defaultValue: 'no-repeat',
              options: [...backgroundRepeatOptions],
            },
            {
              name: 'backgroundSize',
              label: 'Background Size',
              type: 'select',
              defaultValue: 'cover',
              options: [...backgroundSizeOptions],
            },
            {
              name: 'backgroundPosition',
              label: 'Background Position',
              type: 'select',
              defaultValue: 'center',
              options: [...backgroundPositionOptions],
            },
          ],
        },
      ],
    },
    makeRowField(blocks),
  ],
})

// Backward compat — Pages.ts uses this directly when not going through the plugin
export const contentBuilderField = createContentBuilderField(contentBlocks)
