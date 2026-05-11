import process from 'node:process'
import qiniu from 'qiniu'

const accessKey = process.env.QINIU_ACCESS_KEY || ''
const secretKey = process.env.QINIU_SECRET_KEY || ''
const bucket = process.env.QINIU_BUCKET || 'paw-nest'
const domain = process.env.QINIU_DOMAIN || 'https://cdn.example.com'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

export function getUploadToken(key?: string): string {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: key ? `${bucket}:${key}` : bucket,
    expires: 7200,
  })
  return putPolicy.uploadToken(mac)
}

export function getPublicUrl(key: string): string {
  return `${domain}/${key}`
}

export function deleteFile(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config()
    const bucketManager = new qiniu.rs.BucketManager(mac, config)
    bucketManager.delete(bucket, key, (err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}
