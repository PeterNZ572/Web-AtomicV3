'use client'

import Link from 'next/link'
import {
  Check,
  Database,
  FileSpreadsheet,
  Globe2,
  ReceiptText,
  UsersRound,
  Workflow,
} from 'lucide-react'
import { useState } from 'react'

import styles from './AtomicHero.module.css'

type SystemKey = 'excel' | 'xero' | 'crm' | 'website' | 'database'

const systemDetails: Record<SystemKey, { label: string; description: string; capabilities: string[] }> = {
  excel: {
    label: 'Excel',
    description: 'Turn recurring spreadsheet work into reliable data flows.',
    capabilities: ['Report automation', 'Data processing', 'Dashboard feeds'],
  },
  xero: {
    label: 'Xero',
    description: 'Keep finance data accurate without double handling.',
    capabilities: ['Invoice automation', 'Customer syncing', 'Reporting'],
  },
  crm: {
    label: 'CRM',
    description: 'Connect customer activity to the rest of your operation.',
    capabilities: ['Lead workflows', 'API integrations', 'Custom processes'],
  },
  website: {
    label: 'Website & API',
    description: 'Move live customer and operational data where it belongs.',
    capabilities: ['Form workflows', 'Portal data', 'System integrations'],
  },
  database: {
    label: 'Database',
    description: 'Create one dependable source for business-critical data.',
    capabilities: ['Data modelling', 'Secure storage', 'Live reporting'],
  },
}

const systemIcons = {
  excel: FileSpreadsheet,
  xero: ReceiptText,
  crm: UsersRound,
  website: Globe2,
  database: Database,
}

const connectorPaths = {
  excel: 'M 166 124 C 218 124, 212 222, 252 247',
  xero: 'M 428 247 C 474 218, 466 109, 514 109',
  crm: 'M 166 458 C 210 458, 210 354, 252 330',
  website: 'M 428 330 C 475 354, 470 458, 514 458',
  database: 'M 340 386 C 340 430, 340 446, 340 486',
} as const

const packetTimings: Record<SystemKey, { start: number; end: number }> = {
  excel: { start: 0.04, end: 0.2 },
  xero: { start: 0.27, end: 0.43 },
  crm: { start: 0.5, end: 0.66 },
  website: { start: 0.69, end: 0.84 },
  database: { start: 0.76, end: 0.92 },
}

function DataPacket({ system }: { system: SystemKey }) {
  const { start, end } = packetTimings[system]

  return (
    <circle className={`${styles.packet} ${styles[`packet${system}`]}`} r="5">
      <animateMotion
        calcMode="linear"
        dur="8s"
        keyPoints="0;0;1;1"
        keyTimes={`0;${start};${end};1`}
        path={connectorPaths[system]}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        dur="8s"
        keyTimes={`0;${start};${start + 0.015};${end};${Math.min(end + 0.02, 0.98)};1`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
      />
    </circle>
  )
}

function SystemNode({
  system,
  active,
  onActivate,
  className = '',
}: {
  system: SystemKey
  active: boolean
  onActivate: (system: SystemKey | null) => void
  className?: string
}) {
  const Icon = systemIcons[system]
  const detail = systemDetails[system]

  return (
    <button
      type="button"
      className={`${styles.systemNode} ${styles[`node${system}`]} ${active ? styles.nodeActive : ''} ${className}`}
      onBlur={() => onActivate(null)}
      onClick={() => onActivate(active ? null : system)}
      onFocus={() => onActivate(system)}
      onMouseEnter={() => onActivate(system)}
    >
      <span className={styles.nodeIcon} aria-hidden="true">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <span>
        <strong>{detail.label}</strong>
        <small>{system === 'website' ? 'Customer touchpoints' : system === 'database' ? 'Business data' : 'Connected system'}</small>
      </span>
      <span className={styles.nodeSignal} aria-hidden="true" />
    </button>
  )
}

function CoreSystem({ activeSystem, mobile = false }: { activeSystem: SystemKey | null; mobile?: boolean }) {
  return (
    <div className={`${styles.coreSystem} ${mobile ? styles.coreSystemMobile : ''}`}>
      <div className={styles.coreTopbar}>
        <span className={styles.coreMark}><Workflow size={15} strokeWidth={2} /></span>
        <span>Custom operations hub</span>
        <span className={styles.liveStatus}><i /> Live</span>
      </div>
      <div className={styles.coreMetrics}>
        <div>
          <span>Orders processed</span>
          <strong className={styles.metricValue}>482</strong>
        </div>
        <div>
          <span>Automations</span>
          <strong>12 <small>active</small></strong>
        </div>
      </div>
      <div className={styles.coreActivity}>
        <span className={styles.activityIcon}><Check size={13} strokeWidth={2.4} /></span>
        <span>{activeSystem ? `${systemDetails[activeSystem].label} connection ready` : 'Systems are in sync'}</span>
      </div>
    </div>
  )
}

function DetailPanel({ activeSystem }: { activeSystem: SystemKey | null }) {
  if (!activeSystem) {
    return <p className={styles.networkHint}>Hover a system to explore the connection</p>
  }

  const detail = systemDetails[activeSystem]
  return (
    <div className={styles.detailPanel} aria-live="polite">
      <strong>{detail.label}</strong>
      <p>{detail.description}</p>
      <ul>
        {detail.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
      </ul>
    </div>
  )
}

function DesktopNetwork({ activeSystem, onActivate }: { activeSystem: SystemKey | null; onActivate: (system: SystemKey | null) => void }) {
  const focusClass = activeSystem ? styles[`focused${activeSystem}`] : ''

  return (
    <div className={`${styles.desktopNetwork} ${focusClass}`} onMouseLeave={() => onActivate(null)}>
      <div className={styles.networkToolbar}>
        <span><i /> Systems architecture</span>
        <span>Live data flow</span>
      </div>
      <div className={styles.networkCanvas}>
        <svg className={styles.connectors} viewBox="0 0 680 590" role="img" aria-label="Business systems connected through a custom operations hub">
          {Object.entries(connectorPaths).map(([system, path]) => (
            <path key={system} className={`${styles.connector} ${styles[`connector${system}`]}`} d={path} />
          ))}
          {(Object.keys(connectorPaths) as SystemKey[]).map((system) => <DataPacket key={system} system={system} />)}
        </svg>

        {(Object.keys(systemDetails) as SystemKey[]).map((system) => (
          <SystemNode key={system} system={system} active={activeSystem === system} onActivate={onActivate} />
        ))}

        <CoreSystem activeSystem={activeSystem} />
        <DetailPanel activeSystem={activeSystem} />
      </div>
    </div>
  )
}

function MobileNetwork({ activeSystem, onActivate }: { activeSystem: SystemKey | null; onActivate: (system: SystemKey | null) => void }) {
  return (
    <div className={styles.mobileNetwork}>
      <div className={styles.networkToolbar}>
        <span><i /> Systems architecture</span>
        <span>Tap to explore</span>
      </div>
      <div className={styles.mobileCanvas}>
        <svg className={styles.mobileConnectors} viewBox="0 0 360 520" aria-hidden="true">
          <path d="M 180 78 C 180 138, 180 175, 180 220" />
          <path d="M 82 171 C 108 190, 125 226, 140 258" />
          <path d="M 180 374 C 180 414, 180 438, 180 467" />
          <circle r="5"><animateMotion dur="6s" keyPoints="0;0;1;1" keyTimes="0;.04;.26;1" path="M 180 78 C 180 138, 180 175, 180 220" repeatCount="indefinite" /></circle>
          <circle r="5"><animateMotion dur="6s" keyPoints="0;0;1;1" keyTimes="0;.35;.57;1" path="M 82 171 C 108 190, 125 226, 140 258" repeatCount="indefinite" /></circle>
          <circle r="5"><animateMotion dur="6s" keyPoints="0;0;1;1" keyTimes="0;.65;.88;1" path="M 180 374 C 180 414, 180 438, 180 467" repeatCount="indefinite" /></circle>
        </svg>
        <SystemNode system="excel" active={activeSystem === 'excel'} onActivate={onActivate} className={styles.mobileExcel} />
        <SystemNode system="crm" active={activeSystem === 'crm'} onActivate={onActivate} className={styles.mobileCrm} />
        <CoreSystem activeSystem={activeSystem} mobile />
        <SystemNode system="xero" active={activeSystem === 'xero'} onActivate={onActivate} className={styles.mobileXero} />
      </div>
      <DetailPanel activeSystem={activeSystem} />
    </div>
  )
}

export function AtomicHero() {
  const [activeSystem, setActiveSystem] = useState<SystemKey | null>(null)

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span /> Software · Integrations · Analytics</p>
          <h1>Your systems should <em>work together.</em></h1>
          <p className={styles.intro}>We build software, integrations and analytics that connect the tools your business already uses.</p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.primaryAction}>Talk about your project</Link>
            <a href="#systems-map" className={styles.secondaryAction}>See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.proofLine}>
            <span>Built around your business</span>
            <span>Clear, practical outcomes</span>
          </div>
        </div>

        <div className={styles.visual} id="systems-map">
          <DesktopNetwork activeSystem={activeSystem} onActivate={setActiveSystem} />
          <MobileNetwork activeSystem={activeSystem} onActivate={setActiveSystem} />
        </div>
      </div>
    </section>
  )
}
