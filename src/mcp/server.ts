/**
 * Atomic CMS page builder — MCP server (stdio transport).
 *
 * Talks to Payload through the Local API, so it operates on whatever database
 * DATABASE_URI points at. Run it with:  npm run mcp
 *
 * For editing a deployed site, use the HTTP transport instead — see
 * src/app/api/mcp/route.ts and the README.
 */
import 'dotenv/config'

import { Writable } from 'node:stream'

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getPayload, type Payload } from 'payload'

import { createMcpServer } from './create-server'

/**
 * stdout is the JSON-RPC channel. Payload's logger writes there too, which would
 * corrupt the stream — so hand the transport a writer bound to the real stdout
 * and redirect every other stdout write to stderr.
 */
const rawStdoutWrite = process.stdout.write.bind(process.stdout)

const protocolStdout = new Writable({
  write(chunk, encoding, callback) {
    rawStdoutWrite(chunk, encoding as BufferEncoding, callback)
    return true
  },
})

process.stdout.write = ((chunk: any, encoding?: any, callback?: any) =>
  process.stderr.write(chunk, encoding, callback)) as typeof process.stdout.write

let payloadPromise: Promise<Payload> | null = null

/** Booting Payload takes a few seconds, so do it on first use and cache it. */
const client = async (): Promise<Payload> => {
  if (!payloadPromise) {
    payloadPromise = import('../payload.config').then(async ({ default: config }) =>
      getPayload({ config: await config }),
    )
  }

  return payloadPromise
}

const start = async () => {
  const server = createMcpServer(client)
  await server.connect(new StdioServerTransport(process.stdin, protocolStdout))
  process.stderr.write('atomic-page-builder MCP server ready\n')
}

start().catch((error) => {
  process.stderr.write(`Failed to start MCP server: ${error?.stack ?? error}\n`)
  process.exit(1)
})
