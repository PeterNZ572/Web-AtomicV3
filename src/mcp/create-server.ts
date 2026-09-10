/**
 * Builds the MCP server. Shared by both transports — stdio (src/mcp/server.ts)
 * and HTTP (src/app/api/mcp/route.ts) — so the two expose identical behaviour.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import type { Payload } from 'payload'

import { BuilderValidationError } from './compact'
import { toolMap, tools } from './tools'

export type PayloadProvider = () => Promise<Payload>

export const createMcpServer = (getPayload: PayloadProvider): Server => {
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
      const result = await tool.handler(await getPayload(), request.params.arguments ?? {})

      return {
        content: [
          {
            type: 'text' as const,
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
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

  return server
}
