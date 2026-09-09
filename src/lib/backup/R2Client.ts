import {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import type { R2Config } from './types'

export class R2Client {
  private client: S3Client
  private bucket: string

  constructor(config: R2Config) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region || 'auto',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: false,
    })
    this.bucket = config.bucket
  }

  async uploadFile(localPath: string, objectKey: string): Promise<number> {
    const stats = fs.statSync(localPath)
    const fileStream = fs.createReadStream(localPath)

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: objectKey,
        Body: fileStream,
        ContentLength: stats.size,
      },
    })

    await upload.done()
    return stats.size
  }

  async deleteObject(objectKey: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }))
  }

  async listObjects(prefix: string): Promise<Array<{ key: string; lastModified: Date }>> {
    const objects: Array<{ key: string; lastModified: Date }> = []
    let continuationToken: string | undefined

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      )

      for (const obj of response.Contents || []) {
        if (obj.Key && obj.LastModified) {
          objects.push({ key: obj.Key, lastModified: obj.LastModified })
        }
      }

      continuationToken = response.NextContinuationToken
    } while (continuationToken)

    return objects
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}
