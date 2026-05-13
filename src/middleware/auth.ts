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
    jwt.verify(token, accessSecret)
  } catch {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  next()
}
