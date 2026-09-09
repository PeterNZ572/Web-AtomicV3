import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null
let cachedConfig: Promise<SanitizedConfig> | null = null

const loadPayloadConfig = async (): Promise<SanitizedConfig> => {
  if (!cachedConfig) {
    cachedConfig = import('../payload.config').then(async ({ default: config }) => {
      const resolvedConfig = await config

      if (!resolvedConfig) {
        throw new Error('Payload config import did not return a config')
      }

      return resolvedConfig as SanitizedConfig
    })
  }

  return cachedConfig
}

export const getPayloadClient = async () => {
  if (!cachedPayload) {
    const config = await loadPayloadConfig()
    cachedPayload = await getPayload({ config })
  }

  return cachedPayload
}
