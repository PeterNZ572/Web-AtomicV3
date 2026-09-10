/**
 * MCP endpoint for the page builder, exposed on the deployed site.
 *
 * Grants full admin-level control over pages, media and site settings, so it is
 * disabled unless MCP_SECRET is set, and every request must present it as a
 * bearer token.
 */
import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { handleMcpRequest } from '@/mcp/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Long enough that guessing is not a realistic attack on a full-admin endpoint. */
const MIN_SECRET_LENGTH = 32

const jsonRpcError = (code: number, message: string) => ({
  jsonrpc: '2.0' as const,
  id: null,
  error: { code, message },
})

const equals = (a: string, b: string): boolean => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  // timingSafeEqual throws on length mismatch, and the length itself is not secret.
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

type AuthFailure = { status: number; message: string }

const authenticate = (request: Request): AuthFailure | null => {
  const secret = process.env.MCP_SECRET

  if (!secret) {
    return {
      status: 503,
      message: 'MCP endpoint is disabled. Set MCP_SECRET to enable it.',
    }
  }

  if (secret.length < MIN_SECRET_LENGTH) {
    return {
      status: 503,
      message: `MCP endpoint is disabled: MCP_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`,
    }
  }

  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token || !equals(token, secret)) {
    return { status: 401, message: 'Unauthorized' }
  }

  return null
}

export async function POST(request: Request) {
  const failure = authenticate(request)

  if (failure) {
    return NextResponse.json(jsonRpcError(-32001, failure.message), {
      status: failure.status,
      headers: failure.status === 401 ? { 'WWW-Authenticate': 'Bearer' } : undefined,
    })
  }

  try {
    return await handleMcpRequest(request, getPayloadClient)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(jsonRpcError(-32603, message), { status: 500 })
  }
}

/**
 * This server is stateless and never initiates messages, so it offers no SSE
 * stream and has no sessions to terminate. Both are optional in the spec.
 */
export async function GET() {
  return NextResponse.json(jsonRpcError(-32000, 'Method Not Allowed: this endpoint accepts POST'), {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function DELETE() {
  return NextResponse.json(jsonRpcError(-32000, 'Method Not Allowed: this endpoint accepts POST'), {
    status: 405,
    headers: { Allow: 'POST' },
  })
}
