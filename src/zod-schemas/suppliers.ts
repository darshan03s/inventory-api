import z from 'zod'

export const createSupplierSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, 'PHONE_TOO_SHORT')
    .max(15, 'PHONE_TOO_LONG')
    .regex(/^[0-9]+$/, 'INVALID_PHONE'),

  companyName: z.string().trim().min(2, 'COMPANY_NAME_TOO_SHORT').max(100, 'COMPANY_NAME_TOO_LONG')
})

export const supplierSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phone: z.string(),
  companyName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})
