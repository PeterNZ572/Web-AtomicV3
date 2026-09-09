'use client'

import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface BackupRecord {
  id: string
  backupType: 'database' | 'full-site'
  status: 'running' | 'success' | 'failed'
  startedAt: string
  completedAt?: string | null
  durationMs?: number | null
  fileSizeBytes?: number | null
  r2ObjectKey?: string | null
  errorMessage?: string | null
}

interface StatusData {
  lastDbBackup: BackupRecord | null
  lastFullBackup: BackupRecord | null
  r2Configured: boolean
  bucketName: string | null
  siteName: string | null
  dbRetentionCount: number
  fullRetentionCount: number
  dbBackupCron: string
  fullBackupCron: string
}

type HistoryFilter = 'all' | 'database' | 'full-site' | 'success' | 'failed'

interface Notification {
  type: 'success' | 'error'
  message: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return '—'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusCard({
  label,
  record,
}: {
  label: string
  record: BackupRecord | null
}) {
  const ok = record?.status === 'success'
  const failed = record?.status === 'failed'
  const running = record?.status === 'running'

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {record && ok && <StatusDot color="#46a758" />}
        {record && failed && <StatusDot color="#e54d2e" />}
        {record && running && <StatusDot color="#f59e0b" pulse />}
        {!record && <StatusDot color="#555" />}
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      {record ? (
        <>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
            {formatDate(record.startedAt)}
          </div>
          <div style={{ fontSize: '13px', color: '#888' }}>
            {formatBytes(record.fileSizeBytes)}
            {record.durationMs ? ` · ${formatDuration(record.durationMs)}` : ''}
          </div>
          {record.errorMessage && (
            <div style={{ fontSize: '12px', color: '#e54d2e', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {record.errorMessage}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: '14px', color: '#555' }}>No backup yet</div>
      )}
    </div>
  )
}

function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        display: 'inline-block',
        animation: pulse ? 'pulse 1.5s infinite' : undefined,
      }}
    />
  )
}

function HistoryRow({ record }: { record: BackupRecord }) {
  const ok = record.status === 'success'
  const running = record.status === 'running'
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 90px 1fr 80px 60px',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 16px',
        borderBottom: '1px solid #222',
        fontSize: '13px',
      }}
    >
      <span style={{ color: ok ? '#46a758' : running ? '#f59e0b' : '#e54d2e', fontSize: '15px' }}>
        {ok ? '✓' : running ? '⟳' : '✗'}
      </span>
      <span style={{ color: '#aaa', fontWeight: '500' }}>
        {record.backupType === 'database' ? 'Database' : 'Full Site'}
      </span>
      <span style={{ color: '#666' }}>{formatShortDate(record.startedAt)}</span>
      <span style={{ color: '#888', textAlign: 'right' }}>{formatBytes(record.fileSizeBytes)}</span>
      <span style={{ color: '#666', textAlign: 'right' }}>{formatDuration(record.durationMs)}</span>
    </div>
  )
}

function ActionButton({
  label,
  loading,
  onClick,
  disabled,
}: {
  label: string
  loading: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        flex: 1,
        padding: '13px 20px',
        borderRadius: '6px',
        border: '1px solid #333',
        background: disabled || loading ? '#1a1a1a' : '#1e1e1e',
        color: disabled || loading ? '#555' : '#e0e0e0',
        fontSize: '14px',
        fontWeight: '500',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          ;(e.currentTarget as HTMLButtonElement).style.background = '#252525'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#444'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          ;(e.currentTarget as HTMLButtonElement).style.background = '#1e1e1e'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#333'
        }
      }}
    >
      {loading ? <Spinner /> : null}
      {loading ? 'Running…' : label}
    </button>
  )
}

function Spinner() {
  return (
    <span
      style={{
        width: '14px',
        height: '14px',
        border: '2px solid #444',
        borderTopColor: '#888',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: '4px',
        border: active ? '1px solid #444' : '1px solid transparent',
        background: active ? '#252525' : 'transparent',
        color: active ? '#e0e0e0' : '#666',
        fontSize: '12px',
        fontWeight: active ? '600' : '400',
        cursor: 'pointer',
        transition: 'all 0.1s',
      }}
    >
      {label}
    </button>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: '#171717',
  border: '1px solid #252525',
  borderRadius: '8px',
  padding: '20px',
}

const dividerStyle: React.CSSProperties = {
  height: '1px',
  background: '#1f1f1f',
  margin: '28px 0',
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#555',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '14px',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BackupManager() {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [history, setHistory] = useState<BackupRecord[]>([])
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [runningDb, setRunningDb] = useState(false)
  const [runningFull, setRunningFull] = useState(false)
  const [testingR2, setTestingR2] = useState(false)
  const [r2Status, setR2Status] = useState<{ tested: boolean; connected: boolean; error?: string }>({ tested: false, connected: false })
  const [notification, setNotification] = useState<Notification | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  const fetchHistory = useCallback(async (f: HistoryFilter) => {
    const params = new URLSearchParams()
    if (f === 'database' || f === 'full-site') params.set('type', f)
    if (f === 'success' || f === 'failed') params.set('status', f)
    const res = await fetch(`/api/backup/history?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      setHistory(data.docs ?? [])
    }
  }, [])

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true)
    try {
      const res = await fetch('/api/backup/status')
      if (res.ok) setStatus(await res.json())
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    fetchHistory(filter)
  }, [filter, fetchHistory])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 6000)
  }

  const runBackup = async (type: 'database' | 'full') => {
    const setRunning = type === 'database' ? setRunningDb : setRunningFull
    setRunning(true)
    setNotification(null)
    try {
      const res = await fetch(`/api/backup/run?type=${type}`, { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        showNotification(
          'success',
          `${type === 'database' ? 'Database' : 'Full site'} backup completed — ${
            data.fileSizeBytes ? formatBytes(data.fileSizeBytes) : ''
          } in ${formatDuration(data.durationMs)}`,
        )
      } else {
        showNotification('error', data.error || 'Backup failed. Check server logs for details.')
      }
      await Promise.all([fetchStatus(), fetchHistory(filter)])
    } catch {
      showNotification('error', 'Network error. Please try again.')
    } finally {
      setRunning(false)
    }
  }

  const testR2 = async () => {
    setTestingR2(true)
    try {
      const res = await fetch('/api/backup/test-r2', { method: 'POST' })
      const data = await res.json()
      setR2Status({ tested: true, connected: data.success, error: data.error })
    } catch {
      setR2Status({ tested: true, connected: false, error: 'Network error' })
    } finally {
      setTestingR2(false)
    }
  }

  const anyRunning = runningDb || runningFull

  return (
    <div
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '48px 32px 80px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#e0e0e0',
      }}
    >
      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>
          Backup Manager
        </h1>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
          Automated backups to Cloudflare R2 · Configure schedules and credentials in{' '}
          <Link href="/admin/globals/backup-settings" style={{ color: '#888', textDecoration: 'underline' }}>
            Backup Settings
          </Link>
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
            animation: 'slideIn 0.2s ease',
            background: notification.type === 'success' ? '#0d2818' : '#2a0d0d',
            border: `1px solid ${notification.type === 'success' ? '#1a4a2e' : '#4a1a1a'}`,
            color: notification.type === 'success' ? '#46a758' : '#e54d2e',
          }}
        >
          {notification.type === 'success' ? '✓ ' : '✗ '}
          {notification.message}
        </div>
      )}

      {/* Last Backup Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <StatusCard label="Last Database Backup" record={status?.lastDbBackup ?? null} />
        <StatusCard label="Last Full Site Backup" record={status?.lastFullBackup ?? null} />
      </div>

      {/* R2 Connection Row */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {r2Status.tested ? (
            <StatusDot color={r2Status.connected ? '#46a758' : '#e54d2e'} />
          ) : (
            <StatusDot color={status?.r2Configured ? '#444' : '#333'} />
          )}
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#ccc' }}>Cloudflare R2</span>
          <span style={{ fontSize: '12px', color: '#555' }}>
            {r2Status.tested
              ? r2Status.connected
                ? '· Connected'
                : `· ${r2Status.error ?? 'Connection failed'}`
              : status?.r2Configured
                ? '· Configured'
                : '· Not configured'}
          </span>
        </div>
        {status?.bucketName && (
          <span style={{ fontSize: '12px', color: '#555' }}>Bucket: <span style={{ color: '#888' }}>{status.bucketName}</span></span>
        )}
        {status?.siteName && (
          <span style={{ fontSize: '12px', color: '#555' }}>Site: <span style={{ color: '#888' }}>{status.siteName}</span></span>
        )}
        {status?.dbBackupCron && (
          <span style={{ fontSize: '12px', color: '#555' }}>DB: <span style={{ color: '#888' }}>{status.dbBackupCron}</span></span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={testR2}
            disabled={testingR2 || loadingStatus}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#888',
              fontSize: '12px',
              cursor: testingR2 || loadingStatus ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {testingR2 ? <Spinner /> : null}
            {testingR2 ? 'Testing…' : 'Test Connection'}
          </button>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
        <ActionButton
          label="Run Database Backup"
          loading={runningDb}
          disabled={anyRunning}
          onClick={() => runBackup('database')}
        />
        <ActionButton
          label="Run Full Site Backup"
          loading={runningFull}
          disabled={anyRunning}
          onClick={() => runBackup('full')}
        />
      </div>

      <div style={dividerStyle} />

      {/* History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={sectionLabelStyle}>Recent Backups</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(['all', 'database', 'full-site', 'success', 'failed'] as HistoryFilter[]).map((f) => (
              <FilterButton
                key={f}
                label={f === 'all' ? 'All' : f === 'full-site' ? 'Full Site' : f.charAt(0).toUpperCase() + f.slice(1)}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 90px 1fr 80px 60px',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: '1px solid #252525',
              fontSize: '11px',
              fontWeight: '600',
              color: '#444',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            <span />
            <span>Type</span>
            <span>Started</span>
            <span style={{ textAlign: 'right' }}>Size</span>
            <span style={{ textAlign: 'right' }}>Duration</span>
          </div>

          {history.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#444', fontSize: '13px' }}>
              No backups found
            </div>
          ) : (
            history.map((record) => <HistoryRow key={record.id} record={record} />)
          )}
        </div>

        {status && (
          <p style={{ fontSize: '12px', color: '#444', marginTop: '12px', textAlign: 'right' }}>
            Retaining last {status.dbRetentionCount} database · {status.fullRetentionCount} full-site backups in R2
          </p>
        )}
      </div>
    </div>
  )
}
