import type z from 'zod'
import type { registerSchema } from './zod-schemas/auth.js'

export type RegisterUserBody = z.infer<typeof registerSchema>
