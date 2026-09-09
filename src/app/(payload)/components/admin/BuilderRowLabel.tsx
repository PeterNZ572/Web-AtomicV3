'use client'

import { Grid3X3, Settings, X } from 'lucide-react'
import { useField, useRowLabel } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { hideOptions, rowLayoutOptions } from '../../../../lib/builder-config'

// ── Row layout spans (unchanged) ──────────────────────────────────────────────

const rowLayoutLabelMap: Record<string, string> = {
  full: 'Full Width',
  'half-half': '50 / 50',
  'third-third-third': '3 Columns',
  'quarter-quarter-quarter-quarter': '4 Columns',
  'third-two-thirds': '33 / 66',
  'two-thirds-third': '66 / 33',
  'quarter-three-quarters': '25 / 75',
  'three-quarters-quarter': '75 / 25',
  'half-quarter-quarter': '50 / 25 / 25',
  'quarter-half-quarter': '25 / 50 / 25',
  'quarter-quarter-half': '25 / 25 / 50',
}

const rowLayoutSpans: Record<string, number[]> = {
  full: [12],
  'half-half': [6, 6],
  'third-third-third': [4, 4, 4],
  'quarter-quarter-quarter-quarter': [3, 3, 3, 3],
  'third-two-thirds': [4, 8],
  'two-thirds-third': [8, 4],
  'quarter-three-quarters': [3, 9],
  'three-quarters-quarter': [9, 3],
  'half-quarter-quarter': [6, 3, 3],
  'quarter-half-quarter': [3, 6, 3],
  'quarter-quarter-half': [3, 3, 6],
}

const getRowRenderFields = (rowElement: Element): HTMLElement | null => {
  const candidates = Array.from(rowElement.querySelectorAll('.render-fields')) as HTMLElement[]
  return (
    candidates.find((candidate) =>
      Array.from(candidate.children).some((child) => {
        const className = (child as HTMLElement).className
        return typeof className === 'string' && className.includes('atomic-builder__column')
      }),
    ) || null
  )
}

const applyRowLayout = (rowElement: Element, rowLayout: string) => {
  const renderFields = getRowRenderFields(rowElement)
  if (!renderFields) return

  renderFields.style.display = 'grid'
  renderFields.style.gridTemplateColumns = 'repeat(12, minmax(0, 1fr))'
  renderFields.style.gap = '16px'
  renderFields.style.alignItems = 'start'

  const spans = rowLayoutSpans[rowLayout] || rowLayoutSpans.full
  const directChildren = Array.from(renderFields.children) as HTMLElement[]

  for (const child of directChildren) {
    const className = child.className
    if (typeof className !== 'string') continue
    if (!className.includes('atomic-builder__column')) {
      child.style.gridColumn = '1 / -1'
      continue
    }
    const columnMatch = className.match(/atomic-builder__column--(\d)/)
    const columnIndex = columnMatch ? Number(columnMatch[1]) - 1 : -1
    const span = spans[columnIndex] || 12
    child.style.gridColumn = `span ${span}`
  }
}

// ── Field primitives ──────────────────────────────────────────────────────────

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

// ── Modal ─────────────────────────────────────────────────────────────────────

const RowSettingsModal = ({
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
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label="Row Settings">
        <div className="ss-header">
          <div className="ss-header-title">
            <Settings size={15} strokeWidth={2} />
            Row Settings
          </div>
          <button type="button" className="ss-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="ss-body">
          <div className="ss-group">
            <p className="ss-group-heading">Layout</p>
            <div className="ss-grid ss-grid--1">
              <SettingSelect path={`${path}.rowLayout`} label="Row Layout" options={rowLayoutOptions} />
            </div>
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

// ── Row label ─────────────────────────────────────────────────────────────────

type BuilderRowData = {
  rowLayout?: string | null
  rowName?: string | null
}

export const BuilderRowLabel = () => {
  const { data, path } = useRowLabel<BuilderRowData>()
  const rowName = data?.rowName?.trim() || 'Untitled Row'
  const rowLayout = data?.rowLayout || 'full'
  const layoutLabel = rowLayoutLabelMap[rowLayout] || 'Full Width'
  const rowLabelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const openSettings = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }, [])

  const closeSettings = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const rowElement = rowLabelRef.current?.closest('.array-field__row')
    if (!rowElement) return

    rowElement.setAttribute('data-layout', rowLayout)

    const runLayout = () => applyRowLayout(rowElement, rowLayout)
    runLayout()

    const animationFrame = window.requestAnimationFrame(runLayout)
    const observer = new MutationObserver(() => { runLayout() })
    observer.observe(rowElement, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer.disconnect()
      if (rowElement.getAttribute('data-layout') === rowLayout) {
        rowElement.removeAttribute('data-layout')
      }
    }
  }, [rowLayout])

  return (
    <>
      <div ref={rowLabelRef} className="atomic-builder__row-label atomic-builder__row-label--builder-row">
        <span className="atomic-builder__row-label-icon" aria-hidden="true">
          <Grid3X3 size={16} strokeWidth={2.1} />
        </span>
        <span className="atomic-builder__row-label-copy">
          <span className="atomic-builder__row-label-title">{rowName}</span>
          <span className="atomic-builder__row-label-meta">{layoutLabel}</span>
        </span>
        <button
          type="button"
          className="atomic-builder__section-cog"
          onClick={openSettings}
          aria-label="Open Row Settings"
          title="Row Settings"
        >
          <Settings size={14} strokeWidth={2} />
        </button>
      </div>

      {open && <RowSettingsModal path={path} onClose={closeSettings} />}
    </>
  )
}
