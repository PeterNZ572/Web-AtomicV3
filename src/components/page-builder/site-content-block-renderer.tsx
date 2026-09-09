import type { BuilderContentBase } from '../../lib/types'

import { ContentBlockRenderer } from './content-block-renderer'

export const SiteContentBlockRenderer = async ({
  block,
  theme,
}: {
  block: BuilderContentBase
  theme?: string
}) => <ContentBlockRenderer block={block} theme={theme} />
