import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { ApiError } from '../errors.js'
import { verifyAccessToken } from '../middleware/auth.js'

export const testRouter: Router = Router()

testRouter.get(
  '/error-handler',
  withErrorHandler(async () => {
    throw new ApiError('NEW_ERROR')
  })
)

testRouter.get('/protected', verifyAccessToken, (req: Request, res: Response) => {
  const userId = req.userId

  res.json({ message: 'This is protected route', userId })
})
