import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { loginSchema, registerSchema } from '../zod-schemas/auth.js'
import type { JwtPayloadData, LoginUserBody, RegisterUserBody } from '../types.js'
import { ApiError } from '../errors.js'
import { RefreshTokenRepository, UserRepository } from '../db/repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyAccessToken, verifyRefreshToken } from '../middleware/auth.js'
import { hashSha256 } from '../utils/index.js'

export const authRouter: Router = Router()

const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7

function getJwtAccessToken(payload: JwtPayloadData) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m'
  })
}

function getJwtRefreshToken(payload: JwtPayloadData) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  })
}

function setRefreshTokenCookie(refreshToken: string, res: Response) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

authRouter.post(
  '/register',
  withErrorHandler(async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
      const hasShortPassword = validationResult.error.issues.some(
        (issue) => issue.path[0] === 'password' && issue.code === 'too_small'
      )

      if (hasShortPassword) {
        throw new ApiError('PASSWORD_TOO_SHORT', 400)
      }

      throw new ApiError('INVALID_REQUEST_BODY', 400)
    }

    const validatedUser = validationResult.data

    const passwordHash = await bcrypt.hash(validatedUser.password, 10)

    await UserRepository.create({
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
  withErrorHandler(async (req: Request<{}, {}, LoginUserBody>, res: Response) => {
    const validationResult = loginSchema.safeParse(req.body)

    if (!validationResult.success) {
      throw new ApiError('INVALID_REQUEST_BODY', 400)
    }

    const validatedUser = validationResult.data

    const existingUser = await UserRepository.getByEmail(validatedUser.email)

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
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE)
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

    const user = await UserRepository.getById(userId)

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

    await RefreshTokenRepository.rotate(
      oldRefreshTokenHash,
      newRefreshTokenHash,
      userId,
      new Date(Date.now() + REFRESH_TOKEN_MAX_AGE)
    )

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

    await RefreshTokenRepository.deleteByToken(refreshTokenHash)

    clearRefreshTokenCookie(res)

    return res.sendStatus(204)
  })
)

authRouter.get(
  '/me',
  verifyAccessToken,
  withErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId!

    const user = await UserRepository.getByIdWithSupplier(userId)

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 404)
    }

    return res.json(user)
  })
)
