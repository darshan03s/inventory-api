import type z from 'zod'
import type { loginSchema, registerSchema } from './zod-schemas/auth.js'

export type RegisterUserBody = z.infer<typeof registerSchema>

export type LoginUserBody = z.infer<typeof loginSchema>

export type JwtPayloadData = {
  userId: string
}
