import type z from 'zod'
import type { loginSchema, registerSchema } from '../zod-schemas/auth.js'
import type { createSupplierSchema } from '../zod-schemas/suppliers.js'

export type RegisterUserBody = z.infer<typeof registerSchema>

export type LoginUserBody = z.infer<typeof loginSchema>

export type JwtPayloadData = {
  userId: string
}

export type CreateSupplierBody = z.infer<typeof createSupplierSchema>
