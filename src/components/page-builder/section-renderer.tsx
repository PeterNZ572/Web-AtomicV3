import type { BuilderSection } from '../../lib/types'

import { buildBackgroundStyle, getPaddingClassName, getThemeClassName, getVerticalAlignmentClassName, wrapperClassName } from './helpers'
import { RowRenderer } from './row-renderer'

export const SectionRenderer = async ({ section }: { section: BuilderSection }) => {
  const containerClassName = section.fullWidth === 'yes' ? 'max-w-container px-6 lg:px-10' : 'max-w-content px-6 lg:px-10'

  return (
    <section
      id={section.customCssId || undefined}
      className={`${wrapperClassName(section)} ${getThemeClassName(section.themeStyle)} ${getPaddingClassName(section.paddingLevel)}`}
      style={buildBackgroundStyle(section)}
    >
      <div className={`section-inner mx-auto flex flex-col gap-8 ${containerClassName} ${getVerticalAlignmentClassName(section.verticalAlignment)}`}>
        {await Promise.all((section.rows || []).map(async (row, index) => <RowRenderer key={`${row.rowName || 'row'}-${index}`} row={row} theme={section.themeStyle} />))}
      </div>
    </section>
  )
}
