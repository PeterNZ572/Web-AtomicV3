/**
 * MCP over HTTP (the Streamable HTTP transport, in stateless JSON mode).
 *
 * Each POST is handled by a fresh Server instance driven through an in-memory
 * transport, so there is no session state to keep between requests. That suits a
 * serverless/containerised Next.js deployment, and works because the server
 * exposes only tools — nothing that depends on a long-lived connection.
 *
 * Running inside Next.js (rather than as a separate stdio process) is what makes
 * `revalidateTag` in the Pages afterChange hook actually fire, so edits to a
 * published page appear on the live site immediately.
 */
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'

import { createMcpServer, type PayloadProvider } from './create-server'

/** Guards against a wedged tool call holding an HTTP connection open forever. */
const REQUEST_TIMEOUT_MS = 120_000

/** Feeds one message into a Server and captures the single reply it sends back. */
class DirectTransport implements Transport {
  onmessage?: (message: JSONRPCMessage) => void
  onclose?: () => void
  onerror?: (error: Error) => void

  readonly reply: Promise<JSONRPCMessage>
  private settle!: (message: JSONRPCMessage) => void

  constructor() {
    this.reply = new Promise((resolve) => {
      this.settle = resolve
    })
  }

  async start() {}

  async send(message: JSONRPCMessage) {
    this.settle(message)
  }

  async close() {
    this.onclose?.()
  }
}

const jsonRpcError = (id: unknown, code: number, message: string) => ({
  jsonrpc: '2.0' as const,
  id: (id ?? null) as string | number | null,
  error: { code, message },
})

const isNotification = (message: any) => !message || message.id === undefined || message.id === null

const dispatch = async (
  message: JSONRPCMessage,
  getPayload: PayloadProvider,
): Promise<JSONRPCMessage | null> => {
  const server = createMcpServer(getPayload)
  const transport = new DirectTransport()

  await server.connect(transport)

  try {
    transport.onmessage?.(message)

    // Notifications (initialized, cancelled, …) get no response by definition.
    if (isNotification(message)) return null

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timed out handling MCP request')), REQUEST_TIMEOUT_MS),
    )

    return await Promise.race([transport.reply, timeout])
  } catch (error) {
    return jsonRpcError(
      (message as any)?.id,
      -32603,
      error instanceof Error ? error.message : String(error),
    ) as JSONRPCMessage
  } finally {
    await server.close().catch(() => {})
  }
}

/**
 * Handles one MCP HTTP request. Authentication is the caller's responsibility —
 * see src/app/api/mcp/route.ts.
 */
export const handleMcpRequest = async (
  request: Request,
  getPayload: PayloadProvider,
): Promise<Response> => {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(jsonRpcError(null, -32700, 'Parse error: body is not valid JSON'), {
      status: 400,
    })
  }

  // A client may batch messages into an array.
  if (Array.isArray(body)) {
    const replies = (
      await Promise.all(body.map((message) => dispatch(message as JSONRPCMessage, getPayload)))
    ).filter((reply): reply is JSONRPCMessage => reply !== null)

    if (!replies.length) return new Response(null, { status: 202 })
    return Response.json(replies)
  }

  if (!body || typeof body !== 'object') {
    return Response.json(jsonRpcError(null, -32600, 'Invalid Request'), { status: 400 })
  }

  const reply = await dispatch(body as JSONRPCMessage, getPayload)

  // Notification: acknowledged, nothing to return.
  if (!reply) return new Response(null, { status: 202 })

  return Response.json(reply)
}
