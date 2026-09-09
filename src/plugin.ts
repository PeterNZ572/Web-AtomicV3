import type { AdminViewConfig, Block, CollectionConfig, Config, Plugin } from 'payload'

import { BackupHistory } from './collections/BackupHistory'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { createPagesCollection } from './collections/Pages'
import { SiteSettings } from './collections/SiteSettings'
import { Users } from './collections/Users'
import { BackupSettings } from './globals/BackupSettings'

export interface AtomicCMSConfig {
  features?: {
    formSubmissions?: boolean
    backup?: boolean
    siteSettings?: boolean
  }
  additionalCollections?: CollectionConfig[]
  additionalBlocks?: Block[]
  admin?: {
    icon?: string
    logo?: string
    beforeDashboard?: string[]
    afterNavLinks?: string[]
    views?: Record<string, AdminViewConfig>
  }
}

export function createAtomicCMSPlugin(pluginConfig: AtomicCMSConfig = {}): Plugin {
  return (incomingConfig: Config): Config => {
    const {
      features: { formSubmissions = true, backup = true, siteSettings = true } = {},
      additionalCollections = [],
      additionalBlocks = [],
      admin: adminCfg = {},
    } = pluginConfig

    const PagesCollection = createPagesCollection(additionalBlocks)

    const platformCollections: CollectionConfig[] = [
      Users,
      Media,
      PagesCollection,
      ...(siteSettings ? [SiteSettings] : []),
      ...(formSubmissions ? [FormSubmissions] : []),
      ...(backup ? [BackupHistory] : []),
    ]

    const platformGlobals = [...(backup ? [BackupSettings] : [])]

    type AdminComponents = NonNullable<NonNullable<Config['admin']>['components']>

    const existingComponents = (incomingConfig.admin?.components ?? {}) as AdminComponents
    const mergedComponents: AdminComponents = {
      ...existingComponents,
      graphics: {
        ...existingComponents.graphics,
        ...(adminCfg.icon ? { Icon: adminCfg.icon } : {}),
        ...(adminCfg.logo ? { Logo: adminCfg.logo } : {}),
      },
      beforeDashboard: [
        ...(adminCfg.beforeDashboard ?? []),
        ...((existingComponents.beforeDashboard as string[]) ?? []),
      ],
      afterNavLinks: [
        ...((existingComponents.afterNavLinks as string[]) ?? []),
        ...(adminCfg.afterNavLinks ?? []),
      ],
      views: {
        ...existingComponents.views,
        ...(adminCfg.views ?? {}),
      },
    }

    const existingOnInit = incomingConfig.onInit
    const pluginOnInit = async (payload: any) => {
      if (existingOnInit) await existingOnInit(payload)
      if (backup) {
        const { initBackupScheduler } = await import('./lib/backup/scheduler')
        await initBackupScheduler(payload)
      }
    }

    return {
      ...incomingConfig,
      collections: [
        ...platformCollections,
        ...additionalCollections,
        ...(incomingConfig.collections ?? []),
      ],
      globals: [...platformGlobals, ...(incomingConfig.globals ?? [])],
      admin: {
        ...incomingConfig.admin,
        components: mergedComponents,
      },
      onInit: pluginOnInit,
    }
  }
}
