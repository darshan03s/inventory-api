import crypto from 'node:crypto'
import type { ZodType } from 'zod'
import { ApiError } from '../errors.js'

export function hashSha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

export function validateRequest<T>(requestBody: unknown, zodSchema: ZodType<T>): T {
  const validationResult = zodSchema.safeParse(requestBody)

  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0]

    throw new ApiError(firstIssue?.message || 'INVALID_REQUEST_BODY', 400)
  }

  return validationResult.data
}

export function removeUndefinedFields<T extends object>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as {
    [K in keyof T as undefined extends T[K] ? K : K]: Exclude<T[K], undefined>
  }
}
