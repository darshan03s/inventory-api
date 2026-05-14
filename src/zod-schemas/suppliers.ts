import z from 'zod'

export const createSupplierSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .regex(/^[0-9]+$/),

  companyName: z.string().trim().min(2).max(100)
})
