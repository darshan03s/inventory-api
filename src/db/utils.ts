export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if ('code' in error && typeof error.code === 'string' && error.code === '23505') {
    return true
  }

  return 'cause' in error && isUniqueViolation(error.cause)
}
