'use client'

import { ImageIcon, Layers3, Settings, X } from 'lucide-react'
import { useField, useListDrawer, useRowLabel } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  backgroundPositionOptions,
  backgroundRepeatOptions,
  backgroundSizeOptions,
  hideOptions,
  paddingLevelOptions,
  sectionThemeOptions,
  verticalAlignmentOptions,
  yesNoOptions,
} from '../../../../lib/builder-config'

type SectionRowData = {
  sectionName?: string | null
}

// ── Field primitives ─────────────────────────────────────────────────────────

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

// ── Background image picker ───────────────────────────────────────────────────

type MediaDoc = { id: string; filename?: string; url?: string }

const BackgroundImagePicker = ({ path }: { path: string }) => {
  const { value, setValue } = useField<string | MediaDoc | null>({ path })

  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    uploads: true,
    collectionSlugs: ['media'],
  })

  const currentFilename =
    value && typeof value === 'object'
      ? (value as MediaDoc).filename ?? 'Selected'
      : value
        ? String(value)
        : null

  return (
    <div className="ss-field">
      <label className="ss-label">Background Image</label>
      <div className="ss-img-picker">
        {currentFilename ? (
          <span className="ss-img-filename" title={currentFilename}>{currentFilename}</span>
        ) : (
          <span className="ss-img-empty">No image selected</span>
        )}
        <div className="ss-img-actions">
          <button
            type="button"
            className="ss-img-btn"
            onClick={openDrawer}
          >
            <ImageIcon size={13} />
            {currentFilename ? 'Change' : 'Pick Image'}
          </button>
          {currentFilename && (
            <button
              type="button"
              className="ss-img-btn ss-img-btn--clear"
              onClick={() => setValue(null)}
              aria-label="Clear background image"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
      <ListDrawer
        onSelect={({ doc }) => {
          setValue(doc.id as string)
          closeDrawer()
        }}
      />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const SectionSettingsModal = ({
  path,
  onClose,
}: {
  path: string
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
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label="Section Settings">
        <div className="ss-header">
          <div className="ss-header-title">
            <Settings size={15} strokeWidth={2} />
            Section Settings
          </div>
          <button type="button" className="ss-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="ss-body">
          {/* Layout */}
          <div className="ss-group">
            <p className="ss-group-heading">Layout</p>
            <div className="ss-grid">
              <SettingSelect path={`${path}.themeStyle`} label="Theme Style" options={sectionThemeOptions} />
              <SettingSelect path={`${path}.verticalAlignment`} label="Vertical Alignment" options={verticalAlignmentOptions} />
              <SettingSelect path={`${path}.paddingLevel`} label="Padding Level" options={paddingLevelOptions} />
              <SettingSelect path={`${path}.fullWidth`} label="Full Width" options={yesNoOptions} />
            </div>
          </div>

          {/* Background */}
          <div className="ss-group">
            <p className="ss-group-heading">Background</p>
            <BackgroundImagePicker path={`${path}.customBackgroundImage`} />
            <div className="ss-grid ss-grid--3" style={{ marginTop: 10 }}>
              <SettingSelect path={`${path}.backgroundRepeat`} label="Repeat" options={backgroundRepeatOptions} />
              <SettingSelect path={`${path}.backgroundSize`} label="Size" options={backgroundSizeOptions} />
              <SettingSelect path={`${path}.backgroundPosition`} label="Position" options={backgroundPositionOptions} />
            </div>
          </div>

          {/* Advanced */}
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

// ── Row label ─────────────────────────────────────────────────────────────────

export const SectionRowLabel = () => {
  const { data, path } = useRowLabel<SectionRowData>()
  const sectionName = data?.sectionName?.trim() || 'Untitled Section'
  const [open, setOpen] = useState(false)

  const openSettings = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }, [])

  const closeSettings = useCallback(() => setOpen(false), [])

  return (
    <>
      <div className="atomic-builder__row-label atomic-builder__row-label--section">
        <span className="atomic-builder__row-label-icon" aria-hidden="true">
          <Layers3 size={16} strokeWidth={2.1} />
        </span>
        <span className="atomic-builder__row-label-copy">
          <span className="atomic-builder__row-label-title">{sectionName}</span>
          <span className="atomic-builder__row-label-meta">Section</span>
        </span>
        <button
          type="button"
          className="atomic-builder__section-cog"
          onClick={openSettings}
          aria-label="Open Section Settings"
          title="Section Settings"
        >
          <Settings size={14} strokeWidth={2} />
        </button>
      </div>

      {open && <SectionSettingsModal path={path} onClose={closeSettings} />}
    </>
  )
}
