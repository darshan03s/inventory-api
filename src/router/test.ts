import { Router } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { ApiError } from '../errors.js'

export const testRouter: Router = Router()

testRouter.get(
  '/error-handler',
  withErrorHandler(async () => {
    throw new ApiError('NEW_ERROR')
  })
)
