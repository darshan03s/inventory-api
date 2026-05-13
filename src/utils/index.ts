import crypto from 'node:crypto'

export function hashSha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}
