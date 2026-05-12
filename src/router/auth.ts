import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { registerSchema } from '../zod-schemas/auth.js'
import type { RegisterUserBody } from '../types.js'
import { ApiError } from '../errors.js'
import { UserRepository } from '../db/repository.js'
import bcrypt from 'bcrypt'

export const authRouter: Router = Router()

authRouter.post(
  '/register',
  withErrorHandler(async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
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
