import type { Payload } from 'payload'
import { log } from './utils'
import type { BackupSettingsData } from './types'

type ScheduledTask = { stop: () => void }

let dbBackupTask: ScheduledTask | null = null
let fullBackupTask: ScheduledTask | null = null

export async function initBackupScheduler(payload: Payload): Promise<void> {
  try {
    const { schedule, validate } = await import('node-cron')

    let settings: BackupSettingsData = {}
    try {
      settings = (await payload.findGlobal({
        slug: 'backup-settings',
        overrideAccess: true,
      })) as BackupSettingsData
    } catch {
      log('warn', 'Could not load backup settings, using default cron schedule')
    }

    dbBackupTask?.stop()
    fullBackupTask?.stop()

    const dbCron = settings.dbBackupCron || '0 1 * * *'
    const fullCron = settings.fullBackupCron || '0 2 * * *'

    if (!validate(dbCron)) {
      log('warn', `Invalid DB backup cron expression: "${dbCron}" — backup scheduler not started`)
    } else {
      dbBackupTask = schedule(dbCron, async () => {
        log('info', 'Scheduled database backup triggered')
        try {
          const { BackupService } = await import('./BackupService')
          // Re-fetch settings at run time so cron picks up any config changes
          const latestSettings = (await payload
            .findGlobal({ slug: 'backup-settings', overrideAccess: true })
            .catch(() => settings)) as BackupSettingsData
          const service = new BackupService(payload, latestSettings)
          await service.runDatabaseBackup()
        } catch (err) {
          log('error', 'Scheduled database backup encountered an uncaught error', {
            error: err instanceof Error ? err.message : String(err),
          })
        }
      })
      log('info', `Database backup scheduled: ${dbCron}`)
    }

    if (!validate(fullCron)) {
      log('warn', `Invalid full backup cron expression: "${fullCron}" — backup scheduler not started`)
    } else {
      fullBackupTask = schedule(fullCron, async () => {
        log('info', 'Scheduled full site backup triggered')
        try {
          const { BackupService } = await import('./BackupService')
          const latestSettings = (await payload
            .findGlobal({ slug: 'backup-settings', overrideAccess: true })
            .catch(() => settings)) as BackupSettingsData
          const service = new BackupService(payload, latestSettings)
          await service.runFullBackup()
        } catch (err) {
          log('error', 'Scheduled full site backup encountered an uncaught error', {
            error: err instanceof Error ? err.message : String(err),
          })
        }
      })
      log('info', `Full site backup scheduled: ${fullCron}`)
    }

    log('info', 'Backup scheduler initialized')
  } catch (error) {
    log('error', 'Failed to initialize backup scheduler', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
