/**
 * Throwaway connectivity check for DATABASE_URI. Read-only — it opens a
 * connection, reports server details and lists tables, and writes nothing.
 */
import 'dotenv/config'
import net from 'node:net'
import pg from 'pg'

const uri = process.env.DATABASE_URI
if (!uri) {
  console.error('DATABASE_URI is not set')
  process.exit(1)
}

const url = new URL(uri)
const host = url.hostname
const port = Number(url.port || 5432)

const reachable = () =>
  new Promise((resolve) => {
    const socket = net.connect({ host, port })
    const done = (result) => {
      socket.destroy()
      resolve(result)
    }
    socket.setTimeout(8000)
    socket.on('connect', () => done('open'))
    socket.on('timeout', () => done('timed out'))
    socket.on('error', (e) => done(e.code || e.message))
  })

console.log(`1. TCP ${host}:${port} ...`)
const tcp = await reachable()
console.log(`   ${tcp}`)

if (tcp !== 'open') {
  console.log('\nPort is not reachable from here, so the credentials cannot be tested.')
  process.exit(1)
}

const tryConnect = async (label, config) => {
  const client = new pg.Client(config)
  const started = Date.now()
  try {
    await client.connect()
    const { rows: [info] } = await client.query(
      'select current_database() db, current_user usr, version() ver, pg_size_pretty(pg_database_size(current_database())) size',
    )
    const { rows: tables } = await client.query(
      "select table_name from information_schema.tables where table_schema='public' order by table_name",
    )
    let counts = []
    for (const t of ['pages', 'media', 'users', 'site_settings']) {
      if (tables.some((r) => r.table_name === t)) {
        const { rows: [c] } = await client.query(`select count(*)::int n from "${t}"`)
        counts.push(`${t}=${c.n}`)
      }
    }
    console.log(`   CONNECTED in ${Date.now() - started}ms`)
    console.log(`   database: ${info.db}  user: ${info.usr}  size: ${info.size}`)
    console.log(`   ${info.ver.split(',')[0]}`)
    console.log(`   public tables: ${tables.length}`)
    if (counts.length) console.log(`   row counts: ${counts.join('  ')}`)
    else console.log('   (no Payload tables found — this database looks empty/uninitialised)')
    await client.end()
    return true
  } catch (e) {
    console.log(`   FAILED: ${e.message}`)
    try { await client.end() } catch {}
    return false
  }
}

console.log('\n2. Postgres auth, no SSL (what the app currently does) ...')
const plain = await tryConnect('no-ssl', { connectionString: uri, ssl: false, connectionTimeoutMillis: 10000 })

if (!plain) {
  console.log('\n3. Retrying with SSL (sslmode=require, no cert verification) ...')
  await tryConnect('ssl', {
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })
}
