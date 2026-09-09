import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { BackupManager } from './BackupManager'

export function BackupManagerView(props: AdminViewServerProps) {
  const {
    collectionSlug,
    docID,
    documentSubViewType,
    globalSlug,
    i18n,
    initPageResult,
    locale,
    params,
    payload,
    permissions,
    searchParams,
    user,
    viewActions,
    viewType,
  } = props

  const req = initPageResult.req
  const visibleEntities = {
    collections: payload.config.collections.map(({ slug }) => slug),
    globals: payload.config.globals.map(({ slug }) => slug),
  }

  return (
    <DefaultTemplate
      collectionSlug={collectionSlug}
      docID={docID}
      documentSubViewType={documentSubViewType}
      globalSlug={globalSlug}
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      viewActions={viewActions}
      viewType={viewType}
      visibleEntities={visibleEntities}
    >
      <BackupManager />
    </DefaultTemplate>
  )
}
