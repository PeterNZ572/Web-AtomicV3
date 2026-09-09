import type { BuilderColumn } from '../../lib/types'

import { buildInlineStyle, wrapperClassName } from './helpers'
import { SiteContentBlockRenderer } from './site-content-block-renderer'

export const ColumnRenderer = async ({ column, theme }: { column: BuilderColumn; theme?: string }) => (
  <div id={column.customCssId || undefined} className={wrapperClassName(column)} style={buildInlineStyle(column)}>
    <div className="flex flex-col gap-6">
      {await Promise.all(
        (column.contentBlocks || []).map(async (block, index) => (
          <SiteContentBlockRenderer key={`${block.blockType}-${index}`} block={block} theme={theme} />
        )),
      )}
    </div>
  </div>
)
