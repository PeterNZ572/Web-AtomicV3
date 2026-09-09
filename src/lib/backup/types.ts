export type BackupType = 'database' | 'full-site'
export type BackupStatus = 'running' | 'success' | 'failed'

export interface BackupRecord {
  id: string
  backupType: BackupType
  status: BackupStatus
  startedAt: string
  completedAt?: string | null
  durationMs?: number | null
  fileSizeBytes?: number | null
  r2ObjectKey?: string | null
  errorMessage?: string | null
}

export interface BackupSettingsData {
  r2AccountId?: string | null
  r2BucketName?: string | null
  r2AccessKey?: string | null
  r2SecretKey?: string | null
  r2Endpoint?: string | null
  r2Region?: string | null
  siteName?: string | null
  dbBackupCron?: string | null
  fullBackupCron?: string | null
  dbRetentionCount?: number | null
  fullRetentionCount?: number | null
}

export interface BackupResult {
  success: boolean
  objectKey?: string
  fileSizeBytes?: number
  durationMs?: number
  error?: string
}

export interface R2Config {
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}
