import type { BuilderSection } from '../../lib/types'

import { SectionRenderer } from './section-renderer'

export const PageRenderer = async ({ sections }: { sections?: BuilderSection[] }) => {
  if (!sections?.length) {
    return null
  }

  return (
    <>
      {await Promise.all(
        sections.map(async (section, index) => (
          <SectionRenderer key={section.customCssId || `${section.sectionName || 'section'}-${index}`} section={section} />
        )),
      )}
    </>
  )
}
