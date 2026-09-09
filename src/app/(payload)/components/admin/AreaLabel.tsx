'use client'

import { LayoutPanelLeft, Settings, X } from 'lucide-react'
import { useField } from '@payloadcms/ui'
import type { GroupFieldLabelClientComponent } from 'payload'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { hideOptions } from '../../../../lib/builder-config'

// ── Field primitives ──────────────────────────────────────────────────────────

const SettingText = ({ path, label }: { path: string; label: string }) => {
  const { value, setValue } = useField<string>({ path })
  return (
    <div className="ss-field">
      <label className="ss-label">{label}</label>
      <input
        className="ss-input"
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

const SettingTextarea = ({ path, label }: { path: string; label: string }) => {
  const { value, setValue } = useField<string>({ path })
  return (
    <div className="ss-field ss-field--full">
      <label className="ss-label">{label}</label>
      <textarea
        className="ss-textarea"
        value={(value as string) ?? ''}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
    </div>
  )
}

const SettingSelect = ({
  path,
  label,
  options,
}: {
  path: string
  label: string
  options: readonly { label: string; value: string }[]
}) => {
  const { value, setValue } = useField<string>({ path })
  return (
    <div className="ss-field">
      <label className="ss-label">{label}</label>
      <select
        className="ss-select"
        value={(value as string) ?? ''}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const AreaSettingsModal = ({
  path,
  areaLabel,
  onClose,
}: {
  path: string
  areaLabel: string
  onClose: () => void
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="ss-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label={`${areaLabel} Settings`}>
        <div className="ss-header">
          <div className="ss-header-title">
            <Settings size={15} strokeWidth={2} />
            {areaLabel} Settings
          </div>
          <button type="button" className="ss-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="ss-body">
          <div className="ss-group">
            <p className="ss-group-heading">Identity</p>
            <SettingText path={`${path}.columnName`} label="Area Name" />
          </div>

          <div className="ss-group">
            <p className="ss-group-heading">Advanced</p>
            <div className="ss-grid">
              <SettingText path={`${path}.customCssClass`} label="CSS Class" />
              <SettingText path={`${path}.customCssId`} label="CSS ID" />
            </div>
            <SettingTextarea path={`${path}.customInlineStyle`} label="Inline Style" />
            <div className="ss-grid" style={{ marginTop: 12 }}>
              <SettingSelect path={`${path}.hide`} label="Hide on device" options={hideOptions} />
            </div>
          </div>
        </div>

        <div className="ss-footer">
          <button type="button" className="ss-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── Area label ────────────────────────────────────────────────────────────────

export const AreaLabel: GroupFieldLabelClientComponent = ({ label, path }) => {
  const areaLabel = (typeof label === 'string' ? label : 'Area') || 'Area'
  const fieldPath = path ?? ''

  const { value: columnName } = useField<string>({ path: `${fieldPath}.columnName` })
  const displayName = columnName?.trim() || areaLabel

  const [open, setOpen] = useState(false)

  const openSettings = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }, [])

  const closeSettings = useCallback(() => setOpen(false), [])

  return (
    <>
      <div className="atomic-builder__area-label">
        <span className="atomic-builder__area-label-icon" aria-hidden="true">
          <LayoutPanelLeft size={14} strokeWidth={2.1} />
        </span>
        <span className="atomic-builder__area-label-text">{displayName}</span>
        <button
          type="button"
          className="atomic-builder__section-cog"
          onClick={openSettings}
          aria-label={`Open ${areaLabel} Settings`}
          title={`${areaLabel} Settings`}
        >
          <Settings size={13} strokeWidth={2} />
        </button>
      </div>

      {open && (
        <AreaSettingsModal
          path={fieldPath}
          areaLabel={displayName}
          onClose={closeSettings}
        />
      )}
    </>
  )
}
