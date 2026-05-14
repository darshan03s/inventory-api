import crypto from 'node:crypto'
import type { ZodType } from 'zod'
import { ApiError } from '../errors.js'

export function hashSha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

export function validateRequestBody<T>(requestBody: unknown, zodSchema: ZodType<T>): T {
  const validationResult = zodSchema.safeParse(requestBody)

  if (!validationResult.success) {
    throw new ApiError('INVALID_REQUEST_BODY', 400)
  }

  return validationResult.data
}
