'use client'

import type { BlocksFieldClientComponent, ClientBlock, ClientField } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  BlocksDrawer,
  DrawerToggler,
  DraggableSortable,
  DraggableSortableItem,
  FieldDescription,
  FieldError,
  FieldLabel,
  NullifyLocaleField,
  RenderFields,
  useConfig,
  useDrawerSlug,
  useField,
  useForm,
  useTranslation,
} from '@payloadcms/ui'
import {
  Copy,
  FileImage,
  FileText,
  FormInput,
  GalleryHorizontal,
  Images,
  LineChart,
  ListOrdered,
  MapPinned,
  MessageSquareQuote,
  PanelsTopLeft,
  PlayCircle,
  Rocket,
  Settings,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { hideOptions } from '../../../../lib/builder-config'

const baseClass = 'atomic-builder-blocks'

type BlockFieldState = {
  id: string
  blockType: string
  isLoading?: boolean
}

const blockIconMap = {
  accordion: ListOrdered,
  bookingSearchForm: FormInput,
  buttons: Rocket,
  cta: PanelsTopLeft,
  fileTable: FileText,
  form: FormInput,
  gallery: GalleryHorizontal,
  image: FileImage,
  map: MapPinned,
  projectCards: Images,
  slider: Images,
  statistics: LineChart,
  testimonials: MessageSquareQuote,
  text: FileText,
  video: PlayCircle,
} as const

const getBlockPermissions = (
  permissions: unknown,
  block: ClientBlock,
) => {
  if (permissions === true) {
    return true
  }

  const permissionsBlockSpecific =
    typeof permissions === 'object' && permissions
      ? (permissions as { blocks?: Record<string, unknown> | unknown }).blocks &&
        typeof (permissions as { blocks?: Record<string, unknown> }).blocks === 'object'
        ? ((permissions as { blocks?: Record<string, unknown> }).blocks?.[block.slug] ??
          (permissions as { blocks?: unknown }).blocks)
        : (permissions as { blocks?: unknown }).blocks
      : undefined

  if (permissionsBlockSpecific === true) {
    return true
  }

  if (
    permissionsBlockSpecific &&
    typeof permissionsBlockSpecific === 'object' &&
    'fields' in permissionsBlockSpecific
  ) {
    return permissionsBlockSpecific.fields
  }

  if (typeof permissions === 'object' && permissions && !permissionsBlockSpecific) {
    const basePermissions = permissions as { create?: boolean; read?: boolean; update?: boolean }
    const hasReadPermission = basePermissions.read === true
    const missingCreateOrUpdate = !basePermissions.create || !basePermissions.update
    const hasRestrictiveStructure =
      hasReadPermission &&
      (missingCreateOrUpdate ||
        (Object.keys(basePermissions).length === 1 && basePermissions.read === true))

    if (hasRestrictiveStructure) {
      return { read: true }
    }
  }

  return undefined
}

const getBlockLabel = (block: ClientBlock, i18n: unknown) =>
  getTranslation(block.labels?.singular || block.slug, i18n as never)

const BlockTypeIcon = ({ slug }: { slug: string }) => {
  const Icon = blockIconMap[slug as keyof typeof blockIconMap] || FileText
  return <Icon size={16} strokeWidth={2.1} />
}

// ── Block settings field primitives ──────────────────────────────────────────

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

// ── Block settings modal ──────────────────────────────────────────────────────

const BlockSettingsModal = ({
  path,
  blockName,
  onClose,
}: {
  path: string
  blockName: string
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
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label="Block Settings">
        <div className="ss-header">
          <div className="ss-header-title">
            <Settings size={15} strokeWidth={2} />
            Block Settings — {blockName}
          </div>
          <button type="button" className="ss-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="ss-body">
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

// ── Content edit modal ────────────────────────────────────────────────────────

const Modal = ({
  children,
  title,
  blockTypeLabel,
  onClose,
}: {
  children: ReactNode
  title: string
  blockTypeLabel: string
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
      className={`${baseClass}__modal-overlay`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`${baseClass}__modal`} data-theme="light">
        <div className={`${baseClass}__modal-header`}>
          <div>
            <p className={`${baseClass}__modal-eyebrow`}>
              Content Edit
              <span className={`${baseClass}__modal-type-badge`}>{blockTypeLabel}</span>
            </p>
            <h3>{title || blockTypeLabel}</h3>
          </div>
          <button
            type="button"
            className={`${baseClass}__modal-close`}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className={`${baseClass}__modal-body`}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export const AtomicBlocksField: BlocksFieldClientComponent = (props) => {
  const { i18n, t } = useTranslation()
  const {
    field: {
      name,
      admin: { className, description, isSortable = true } = {},
      blockReferences,
      blocks,
      label,
      labels: labelsFromProps,
      localized,
      maxRows,
      minRows: minRowsProp,
      required,
    },
    path: pathFromProps,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props

  const schemaPath = schemaPathFromProps ?? name
  const minRows = (minRowsProp ?? required) ? 1 : 0
  const drawerSlug = useDrawerSlug(`${pathFromProps}-blocks-drawer`)
  const { addFieldRow, dispatchFields, getFields, moveFieldRow, removeFieldRow, replaceState, setModified } =
    useForm()
  const {
    config: { blocksMap },
  } = useConfig()
  const blockRegistry = blocksMap as Record<string, ClientBlock>
  const {
    blocksFilterOptions,
    disabled,
    errorPaths: fieldErrorPaths,
    path,
    rows = [],
    showError,
    valid,
    value,
  } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
    validate: useCallback(
      (incomingValue: unknown, options: Record<string, unknown>) => {
        if (typeof validate === 'function') {
          return validate(incomingValue, { ...options, maxRows, minRows, required } as never)
        }
        return true
      },
      [maxRows, minRows, required, validate],
    ),
  })
  const errorPaths = useMemo(() => fieldErrorPaths ?? [], [fieldErrorPaths])

  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)
  const [settingsRowIndex, setSettingsRowIndex] = useState<number | null>(null)
  const [snapshot, setSnapshot] = useState<ReturnType<typeof getFields> | null>(null)
  // Incremented after each save so card names refresh from form state
  const [nameRefreshKey, setNameRefreshKey] = useState(0)

  const labels = useMemo(
    () => ({
      plural: t('fields:blocks'),
      singular: t('fields:block'),
      ...labelsFromProps,
    }),
    [labelsFromProps, t],
  )

  const clientBlocks = useMemo(() => {
    let resolvedBlocks: ClientBlock[] = []

    if (!blockReferences) {
      resolvedBlocks = blocks as ClientBlock[]
    } else {
      for (const blockReference of blockReferences) {
        const resolvedBlock = typeof blockReference === 'string' ? blockRegistry[blockReference] : blockReference
        if (resolvedBlock) resolvedBlocks.push(resolvedBlock)
      }
    }

    if (Array.isArray(blocksFilterOptions)) {
      return resolvedBlocks.filter((block) => blocksFilterOptions.includes(block.slug))
    }

    return resolvedBlocks
  }, [blockReferences, blockRegistry, blocks, blocksFilterOptions])

  // Read actual field values from form state for display names
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentFields = useMemo(() => getFields(), [nameRefreshKey, rows, getFields])

  const rowsWithConfig = useMemo(
    () =>
      rows
        .map((row, index) => {
          const typedRow = row as BlockFieldState
          const blockConfig = blockRegistry[typedRow.blockType] ?? clientBlocks.find((b) => b.slug === typedRow.blockType)
          if (!blockConfig) return null

          const rowPath = `${path}.${index}`
          const nameFieldValue = currentFields[`${rowPath}.blockName`]?.value
          const blockName =
            typeof nameFieldValue === 'string' && nameFieldValue.trim()
              ? nameFieldValue.trim()
              : getBlockLabel(blockConfig, i18n)

          return {
            blockConfig,
            blockName,
            errorCount: errorPaths.filter((ep) => ep.startsWith(`${rowPath}.`)).length,
            row: typedRow,
            rowIndex: index,
            rowPath,
          }
        })
        .filter(Boolean) as Array<{
        blockConfig: ClientBlock
        blockName: string
        errorCount: number
        row: BlockFieldState
        rowIndex: number
        rowPath: string
      }>,
    [blockRegistry, clientBlocks, currentFields, errorPaths, i18n, path, rows],
  )

  const activeRow = activeRowIndex === null ? null : rowsWithConfig[activeRowIndex] || null
  const hasMaxRows = Boolean(maxRows && rows.length >= maxRows)
  const showRequiredState = (!valid || showError) && rows.length === 0 && required

  const addRow = useCallback(
    (rowIndex: number, blockType?: string) => {
      if (!blockType) return
      addFieldRow({ blockType, path, rowIndex, schemaPath })
    },
    [addFieldRow, path, schemaPath],
  )

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })
      setModified(true)
      setNameRefreshKey((k) => k + 1)
    },
    [dispatchFields, path, setModified],
  )

  const deleteRow = useCallback(
    (rowIndex: number) => {
      removeFieldRow({ path, rowIndex })
      if (activeRowIndex === rowIndex) {
        setActiveRowIndex(null)
        setSnapshot(null)
      }
    },
    [activeRowIndex, path, removeFieldRow],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      moveFieldRow({ moveFromIndex, moveToIndex, path })
    },
    [moveFieldRow, path],
  )

  const openEditor = useCallback(
    (rowIndex: number) => {
      setSnapshot(getFields())
      setActiveRowIndex(rowIndex)
    },
    [getFields],
  )

  const closeEditor = useCallback(() => {
    setActiveRowIndex(null)
    setSnapshot(null)
  }, [])

  const cancelEditor = useCallback(() => {
    if (snapshot) replaceState(snapshot)
    closeEditor()
  }, [closeEditor, replaceState, snapshot])

  const saveEditor = useCallback(() => {
    setModified(true)
    setNameRefreshKey((k) => k + 1)
    closeEditor()
  }, [closeEditor, setModified])

  return (
    <div className={[baseClass, className, showError ? `${baseClass}--has-error` : ''].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__header`}>
        <FieldLabel as="span" label={label} localized={localized} path={path} required={required} />
        <FieldDescription description={description} path={path} />
      </div>

      {showError && <FieldError path={path} showError={showError} />}

      <NullifyLocaleField fieldValue={value} localized={Boolean(localized)} path={path} readOnly={Boolean(readOnly)} />

      {rowsWithConfig.length > 0 && (
        <DraggableSortable
          className={`${baseClass}__grid`}
          ids={rowsWithConfig.map(({ row }) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rowsWithConfig.map(({ blockConfig, blockName, errorCount, row, rowIndex }) => (
            <DraggableSortableItem disabled={readOnly || disabled || !isSortable} id={row.id} key={row.id}>
              {({ attributes, listeners, setNodeRef, transform }) => (
                <article
                  ref={setNodeRef}
                  style={{ transform }}
                  className={`${baseClass}__card ${errorCount > 0 ? `${baseClass}__card--error` : ''}`}
                >
                  <div className={`${baseClass}__card-main`}>
                    <button
                      type="button"
                      className={`${baseClass}__drag-handle`}
                      aria-label={`Reorder ${blockName}`}
                      {...attributes}
                      {...listeners}
                    >
                      <Grid3DragIcon />
                    </button>
                    <div className={`${baseClass}__card-copy`}>
                      <span className={`${baseClass}__card-icon`} aria-hidden="true">
                        <BlockTypeIcon slug={blockConfig.slug} />
                      </span>
                      <div className={`${baseClass}__card-copy-body`}>
                        <h4>{blockName}</h4>
                        <p>{getBlockLabel(blockConfig, i18n)}</p>
                      </div>
                    </div>
                    <div className={`${baseClass}__card-actions`}>
                      {errorCount > 0 && <span className={`${baseClass}__card-error`}>{errorCount}</span>}
                      <button type="button" aria-label={`Edit ${blockName}`} title="Edit" onClick={() => openEditor(rowIndex)}>
                        <SquarePen size={15} />
                      </button>
                      <button type="button" aria-label={`Block settings for ${blockName}`} title="Block Settings" onClick={() => setSettingsRowIndex(rowIndex)}>
                        <Settings size={15} />
                      </button>
                      <button type="button" aria-label={`Duplicate ${blockName}`} title="Duplicate" onClick={() => duplicateRow(rowIndex)}>
                        <Copy size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${blockName}`}
                        title="Delete"
                        className={`${baseClass}__card-action--danger`}
                        onClick={() => deleteRow(rowIndex)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              )}
            </DraggableSortableItem>
          ))}
        </DraggableSortable>
      )}

      {!rowsWithConfig.length && (
        <div className={`${baseClass}__empty`}>
          <p>No content blocks yet.</p>
          <span>Add a block to start building this column.</span>
        </div>
      )}

      {!hasMaxRows && (
        <div className={`${baseClass}__footer`}>
          <DrawerToggler className={`${baseClass}__drawer-toggler`} disabled={readOnly || disabled} slug={drawerSlug}>
            <span className={`${baseClass}__add-btn`} aria-disabled={readOnly || disabled}>
              <PlusIcon />
              Add Content
            </span>
          </DrawerToggler>
          <BlocksDrawer addRow={addRow} addRowIndex={rows.length || 0} blocks={clientBlocks} drawerSlug={drawerSlug} labels={labels} />
        </div>
      )}

      {showRequiredState && <p className={`${baseClass}__required`}>At least one content block is required here.</p>}

      {settingsRowIndex !== null && rowsWithConfig[settingsRowIndex] && (
        <BlockSettingsModal
          path={rowsWithConfig[settingsRowIndex].rowPath}
          blockName={rowsWithConfig[settingsRowIndex].blockName}
          onClose={() => setSettingsRowIndex(null)}
        />
      )}

      {activeRow && (
        <Modal
          title={activeRow.blockName}
          blockTypeLabel={getBlockLabel(activeRow.blockConfig, i18n)}
          onClose={cancelEditor}
        >
          <RenderFields
            className={`${baseClass}__modal-fields`}
            fields={activeRow.blockConfig.fields as ClientField[]}
            margins="small"
            parentIndexPath=""
            parentPath={activeRow.rowPath}
            parentSchemaPath={`${schemaPath}.${activeRow.blockConfig.slug}`}
            permissions={getBlockPermissions(permissions, activeRow.blockConfig) as never}
            readOnly={readOnly || disabled}
          />
          <div className={`${baseClass}__modal-actions`}>
            <button type="button" className={`${baseClass}__modal-button ${baseClass}__modal-button--secondary`} onClick={cancelEditor}>
              Cancel
            </button>
            <button type="button" className={`${baseClass}__modal-button`} onClick={saveEditor}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Grid3DragIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="3" cy="3" r="1.25" fill="currentColor" />
    <circle cx="7" cy="3" r="1.25" fill="currentColor" />
    <circle cx="11" cy="3" r="1.25" fill="currentColor" />
    <circle cx="3" cy="7" r="1.25" fill="currentColor" />
    <circle cx="7" cy="7" r="1.25" fill="currentColor" />
    <circle cx="11" cy="7" r="1.25" fill="currentColor" />
    <circle cx="3" cy="11" r="1.25" fill="currentColor" />
    <circle cx="7" cy="11" r="1.25" fill="currentColor" />
    <circle cx="11" cy="11" r="1.25" fill="currentColor" />
  </svg>
)
