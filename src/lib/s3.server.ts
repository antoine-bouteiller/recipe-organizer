import { env } from '@/config/env.server'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: env.S3_URL,
  region: 'eu-west-3',
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
})

export async function uploadFile(file: File) {
  const key = randomUUID()

  // Convert File to Buffer to avoid hash calculation errors
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type, // Add content type for better file handling
    ContentLength: buffer.length, // Explicitly set content length
  })

  await s3Client.send(command)

  return key
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  })

  await s3Client.send(command)
}
