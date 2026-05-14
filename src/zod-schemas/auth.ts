import z from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'NAME_REQUIRED'),

  email: z.email('INVALID_EMAIL'),

  password: z.string().min(8, 'PASSWORD_TOO_SHORT')
})

export const loginSchema = z.object({
  email: z.email('INVALID_EMAIL'),

  password: z.string().min(1, 'PASSWORD_REQUIRED')
})
