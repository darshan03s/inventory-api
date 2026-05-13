import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from '../errors.js'

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization

  if (!authorization) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET!

  try {
    const payload = jwt.verify(token, accessSecret)

    if (typeof payload === 'string' || typeof payload.userId !== 'string') {
      throw new ApiError('INVALID_TOKEN', 401)
    }

    req.userId = payload.userId
  } catch {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  next()
}
