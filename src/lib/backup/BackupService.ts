import fs from 'fs'
import path from 'path'
import os from 'os'
import { pipeline } from 'stream/promises'
import zlib from 'zlib'
import Database from 'better-sqlite3'
import type { Archiver, ArchiverOptions } from 'archiver'
import type { Payload } from 'payload'
import { R2Client } from './R2Client'
import { formatTimestamp, formatBytes, formatDuration, getDatabasePath, isSqliteDatabase, log } from './utils'
import type { BackupResult, BackupSettingsData, R2Config } from './types'

export class BackupService {
  private payload: Payload
  private settings: BackupSettingsData

  constructor(payload: Payload, settings: BackupSettingsData) {
    this.payload = payload
    this.settings = settings
  }

  private buildR2Client(): R2Client {
    const { r2Endpoint, r2Region, r2AccessKey, r2SecretKey, r2BucketName } = this.settings
    if (!r2Endpoint || !r2AccessKey || !r2SecretKey || !r2BucketName) {
      throw new Error(
        'R2 credentials are not fully configured. Set Endpoint, Access Key, Secret Key, and Bucket Name in Backup Settings.',
      )
    }
    return new R2Client({
      endpoint: r2Endpoint,
      region: r2Region || 'auto',
      accessKeyId: r2AccessKey,
      secretAccessKey: r2SecretKey,
      bucket: r2BucketName,
    } as R2Config)
  }

  async runDatabaseBackup(): Promise<BackupResult> {
    const startTime = Date.now()
    const siteName = this.settings.siteName || 'site'
    const timestamp = formatTimestamp()
    const objectKey = `Backups/${siteName}/DB/${timestamp}.db.gz`

    let historyId: string | undefined
    let tempDir: string | undefined

    try {
      const record = await this.payload.create({
        collection: 'backup-history',
        data: { backupType: 'database', status: 'running', startedAt: new Date().toISOString() },
        overrideAccess: true,
      })
      historyId = record.id as string

      if (!isSqliteDatabase()) {
        throw new Error('Database backups currently only support SQLite. Postgres backup support is not yet implemented.')
      }

      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'atomic-backup-'))
      const dbPath = getDatabasePath()
      const backupDbPath = path.join(tempDir, 'backup.db')
      const gzPath = path.join(tempDir, 'backup.db.gz')

      log('info', 'Starting database backup', { dbPath, objectKey })

      await sqliteBackup(dbPath, backupDbPath)
      log('info', 'SQLite online backup complete')

      await gzipFile(backupDbPath, gzPath)
      const gzStats = await fs.promises.stat(gzPath)
      log('info', `Compressed: ${formatBytes(gzStats.size)}`)

      const r2 = this.buildR2Client()
      log('info', `Uploading to R2: ${objectKey}`)
      const uploadStart = Date.now()
      await r2.uploadFile(gzPath, objectKey)
      const uploadMs = Date.now() - uploadStart
      const speedMBs = ((gzStats.size / 1024 / 1024) / (uploadMs / 1000)).toFixed(2)
      log('info', 'Upload complete', {
        durationMs: uploadMs,
        uploadSpeed: `${speedMBs} MB/s`,
        sizeBytes: gzStats.size,
      })

      await this.enforceRetention('database', siteName, r2)

      const durationMs = Date.now() - startTime
      log('info', `Database backup finished in ${formatDuration(durationMs)}`)

      await this.payload.update({
        collection: 'backup-history',
        id: historyId,
        data: {
          status: 'success',
          completedAt: new Date().toISOString(),
          durationMs,
          fileSizeBytes: gzStats.size,
          r2ObjectKey: objectKey,
        },
        overrideAccess: true,
      })

      return { success: true, objectKey, fileSizeBytes: gzStats.size, durationMs }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      log('error', 'Database backup failed', { error: errorMessage })

      if (historyId) {
        await this.payload
          .update({
            collection: 'backup-history',
            id: historyId,
            data: {
              status: 'failed',
              completedAt: new Date().toISOString(),
              durationMs: Date.now() - startTime,
              errorMessage,
            },
            overrideAccess: true,
          })
          .catch(() => {})
      }

      return { success: false, error: errorMessage, durationMs: Date.now() - startTime }
    } finally {
      if (tempDir) {
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      }
    }
  }

  async runFullBackup(): Promise<BackupResult> {
    const startTime = Date.now()
    const siteName = this.settings.siteName || 'site'
    const timestamp = formatTimestamp()
    const objectKey = `Backups/${siteName}/Site/${timestamp}.zip`

    let historyId: string | undefined
    let tempDir: string | undefined

    try {
      const record = await this.payload.create({
        collection: 'backup-history',
        data: { backupType: 'full-site', status: 'running', startedAt: new Date().toISOString() },
        overrideAccess: true,
      })
      historyId = record.id as string

      if (!isSqliteDatabase()) {
        throw new Error('Database backups currently only support SQLite. Postgres backup support is not yet implemented.')
      }

      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'atomic-backup-'))
      const zipPath = path.join(tempDir, 'backup.zip')

      log('info', 'Starting full site backup', { objectKey })

      const dbPath = getDatabasePath()
      const backupDbPath = path.join(tempDir, 'database.db')
      await sqliteBackup(dbPath, backupDbPath)
      log('info', 'Database snapshotted')

      log('info', 'Creating ZIP archive...')
      const fileSizeBytes = await createZipArchive(zipPath, backupDbPath)
      log('info', `ZIP created: ${formatBytes(fileSizeBytes)}`)

      const r2 = this.buildR2Client()
      log('info', `Uploading to R2: ${objectKey}`)
      const uploadStart = Date.now()
      await r2.uploadFile(zipPath, objectKey)
      const uploadMs = Date.now() - uploadStart
      const speedMBs = ((fileSizeBytes / 1024 / 1024) / (uploadMs / 1000)).toFixed(2)
      log('info', 'Upload complete', {
        durationMs: uploadMs,
        uploadSpeed: `${speedMBs} MB/s`,
        sizeBytes: fileSizeBytes,
      })

      await this.enforceRetention('full-site', siteName, r2)

      const durationMs = Date.now() - startTime
      log('info', `Full site backup finished in ${formatDuration(durationMs)}`)

      await this.payload.update({
        collection: 'backup-history',
        id: historyId,
        data: {
          status: 'success',
          completedAt: new Date().toISOString(),
          durationMs,
          fileSizeBytes,
          r2ObjectKey: objectKey,
        },
        overrideAccess: true,
      })

      return { success: true, objectKey, fileSizeBytes, durationMs }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      log('error', 'Full site backup failed', { error: errorMessage })

      if (historyId) {
        await this.payload
          .update({
            collection: 'backup-history',
            id: historyId,
            data: {
              status: 'failed',
              completedAt: new Date().toISOString(),
              durationMs: Date.now() - startTime,
              errorMessage,
            },
            overrideAccess: true,
          })
          .catch(() => {})
      }

      return { success: false, error: errorMessage, durationMs: Date.now() - startTime }
    } finally {
      if (tempDir) {
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      }
    }
  }

  async testR2Connection(): Promise<{ success: boolean; error?: string }> {
    try {
      const r2 = this.buildR2Client()
      return await r2.testConnection()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  private async enforceRetention(
    type: 'database' | 'full-site',
    siteName: string,
    r2: R2Client,
  ): Promise<void> {
    try {
      const retentionCount =
        type === 'database'
          ? (this.settings.dbRetentionCount ?? 30)
          : (this.settings.fullRetentionCount ?? 30)

      const prefix = type === 'database' ? `Backups/${siteName}/DB/` : `Backups/${siteName}/Site/`

      const objects = await r2.listObjects(prefix)
      objects.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime())

      const toDelete = objects.slice(0, Math.max(0, objects.length - retentionCount))

      for (const obj of toDelete) {
        await r2.deleteObject(obj.key)
        log('info', `Retention: deleted old backup ${obj.key}`)
      }

      if (toDelete.length > 0) {
        log('info', `Retention: removed ${toDelete.length} old ${type} backup(s)`)
      }
    } catch (error) {
      log('warn', 'Retention enforcement failed (non-fatal)', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

async function sqliteBackup(dbPath: string, destPath: string): Promise<void> {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true })
  try {
    await db.backup(destPath)
  } finally {
    db.close()
  }
}

async function gzipFile(inputPath: string, outputPath: string): Promise<void> {
  const source = fs.createReadStream(inputPath)
  const destination = fs.createWriteStream(outputPath)
  const gzip = zlib.createGzip({ level: 6 })
  await pipeline(source, gzip, destination)
}

async function createZipArchive(zipPath: string, backupDbPath: string): Promise<number> {
  const cwd = process.cwd()
  const { ZipArchive } = (await import('archiver')) as {
    ZipArchive: new (options?: ArchiverOptions) => Archiver
  }

  return new Promise<number>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath)
    const archive = new ZipArchive({ zlib: { level: 6 } })

    output.on('close', () => resolve(archive.pointer()))
    archive.on('error', reject)
    archive.pipe(output)

    // Proper SQLite backup (not the raw live file)
    archive.file(backupDbPath, { name: 'database.db' })

    // Media uploads
    for (const mediaDir of ['public/media', 'media', 'uploads']) {
      const fullPath = path.join(cwd, mediaDir)
      if (fs.existsSync(fullPath)) {
        archive.directory(fullPath, mediaDir)
      }
    }

    // Runtime config files
    for (const configFile of ['.env', 'docker-compose.yml', 'docker-compose.yaml']) {
      const fullPath = path.join(cwd, configFile)
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: configFile })
      }
    }

    archive.finalize()
  })
}
