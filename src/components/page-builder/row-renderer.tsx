import { rowLayoutTemplates } from '../../lib/builder-config'
import type { BuilderColumn, BuilderRow } from '../../lib/types'

import { buildInlineStyle, wrapperClassName } from './helpers'
import { ColumnRenderer } from './column-renderer'

const orderedColumns = (row: BuilderRow): BuilderColumn[] => [row.column1, row.column2, row.column3, row.column4].filter(Boolean) as BuilderColumn[]

export const RowRenderer = async ({ row, theme }: { row: BuilderRow; theme?: string }) => {
  const columns = orderedColumns(row)

  return (
    <div id={row.customCssId || undefined} className={wrapperClassName(row)} style={buildInlineStyle(row)}>
      <div className={`grid grid-cols-1 gap-6 ${rowLayoutTemplates[row.rowLayout || 'full'] || 'md:grid-cols-1'}`}>
        {await Promise.all(columns.map(async (column, index) => <ColumnRenderer key={`${column.columnName || 'column'}-${index}`} column={column} theme={theme} />))}
      </div>
    </div>
  )
}
