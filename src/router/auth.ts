import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '@/error-handler.js'
import { loginSchema, registerSchema } from '@/zod-schemas/auth.js'
import type { JwtPayloadData } from '@/types/index.js'
import { ApiError } from '@/errors.js'
import { RefreshTokenRepository, UsersRepository } from '@/db/repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyAccessToken, verifyRefreshToken } from '@/middleware/auth.js'
import { hashSha256, validateRequest } from '@/utils/index.js'
import { env } from '@/env.js'

export const authRouter: Router = Router()

const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7

function getJwtAccessToken(payload: JwtPayloadData) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  })
}

function getJwtRefreshToken(payload: JwtPayloadData) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  })
}

function setRefreshTokenCookie(refreshToken: string, res: Response) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

authRouter.post(
  '/register',
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedUser = validateRequest(req.body, registerSchema)

    const passwordHash = await bcrypt.hash(validatedUser.password, 10)

    await UsersRepository.create({
      ...validatedUser,
      passwordHash
    })

    res.status(201).json({
      code: 'USER_REGISTERED'
    })
  })
)

authRouter.post(
  '/login',
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedUser = validateRequest(req.body, loginSchema)

    const existingUser = await UsersRepository.getByEmail(validatedUser.email)

    if (!existingUser) {
      throw new ApiError('INVALID_CREDENTIALS', 401)
    }

    const isPasswordCorrect = await bcrypt.compare(
      validatedUser.password,
      existingUser.passwordHash
    )

    if (!isPasswordCorrect) {
      throw new ApiError('INVALID_CREDENTIALS', 401)
    }

    const payload: JwtPayloadData = {
      userId: existingUser.id
    }

    const accessToken = getJwtAccessToken(payload)

    const refreshToken = getJwtRefreshToken(payload)

    const hashedRefreshToken = hashSha256(refreshToken)

    await RefreshTokenRepository.create({
      userId: existingUser.id,
      token: hashedRefreshToken
    })

    setRefreshTokenCookie(refreshToken, res)

    return res.json({
      accessToken: accessToken,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt
      }
    })
  })
)

authRouter.post(
  '/refresh',
  verifyRefreshToken,
  withErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId!
    const oldRefreshToken = req.cookies.refreshToken

    const user = await UsersRepository.getById(userId)

    if (!user) {
      throw new ApiError('INVALID_USER', 401)
    }

    const payload: JwtPayloadData = {
      userId: userId
    }

    const accessToken = getJwtAccessToken(payload)

    const newRefreshToken = getJwtRefreshToken(payload)

    const oldRefreshTokenHash = hashSha256(oldRefreshToken)
    const newRefreshTokenHash = hashSha256(newRefreshToken)

    await RefreshTokenRepository.rotate(oldRefreshTokenHash, newRefreshTokenHash, userId)

    setRefreshTokenCookie(newRefreshToken, res)

    return res.json({
      accessToken: accessToken
    })
  })
)

authRouter.post(
  '/logout',
  withErrorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.sendStatus(204)
    }

    const refreshTokenHash = hashSha256(refreshToken)

    try {
      await RefreshTokenRepository.deleteByToken(refreshTokenHash)
    } finally {
      clearRefreshTokenCookie(res)
    }

    return res.sendStatus(204)
  })
)

authRouter.get(
  '/me',
  verifyAccessToken,
  withErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId!

    const user = await UsersRepository.getByIdWithSupplier(userId)

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 404)
    }

    return res.json({ user })
  })
)
