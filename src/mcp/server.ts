/**
 * Atomic CMS page builder — MCP server (stdio).
 *
 * Talks to Payload through the Local API, so it operates on whatever database
 * DATABASE_URI points at. Run it with:  npm run mcp
 */
import 'dotenv/config'

import { Writable } from 'node:stream'

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { getPayload, type Payload } from 'payload'

import { BuilderValidationError } from './compact'
import { toolMap, tools } from './tools'

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

const server = new Server(
  { name: 'atomic-page-builder', version: '0.1.0' },
  { capabilities: { tools: {} } },
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolMap.get(request.params.name)

  if (!tool) {
    return {
      isError: true,
      content: [{ type: 'text' as const, text: `Unknown tool: ${request.params.name}` }],
    }
  }

  try {
    const result = await tool.handler(await client(), request.params.arguments ?? {})

    return {
      content: [
        { type: 'text' as const, text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) },
      ],
    }
  } catch (error) {
    // Validation errors name the exact path that failed, so surface them verbatim —
    // they are what lets the model correct its own payload without a round trip.
    const message =
      error instanceof BuilderValidationError
        ? `Invalid builder content — ${error.message}`
        : error instanceof Error
          ? error.message
          : String(error)

    return { isError: true, content: [{ type: 'text' as const, text: message }] }
  }
})

const start = async () => {
  await server.connect(new StdioServerTransport(process.stdin, protocolStdout))
  process.stderr.write('atomic-page-builder MCP server ready\n')
}

start().catch((error) => {
  process.stderr.write(`Failed to start MCP server: ${error?.stack ?? error}\n`)
  process.exit(1)
})
