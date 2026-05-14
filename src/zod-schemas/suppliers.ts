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
