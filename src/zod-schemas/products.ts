import z from 'zod'

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'PRODUCT_NAME_TOO_SHORT').max(100, 'PRODUCT_NAME_TOO_LONG'),

  description: z
    .string()
    .trim()
    .min(1, 'PRODUCT_DESCRIPTION_REQUIRED')
    .max(1000, 'PRODUCT_DESCRIPTION_TOO_LONG'),

  sku: z
    .string()
    .trim()
    .toUpperCase()
    .trim()
    .min(1, 'SKU_REQUIRED')
    .max(100, 'SKU_TOO_LONG')
    .regex(/^[a-zA-Z0-9_-]+$/, 'INVALID_SKU'),

  price: z.number().int('INVALID_PRICE').positive('PRICE_MUST_BE_POSITIVE'),

  stockQuantity: z.number().int('INVALID_STOCK_QUANTITY').nonnegative('INVALID_STOCK_QUANTITY')
})

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'AT_LEAST_ONE_FIELD_REQUIRED'
  })

export const productIdParamsSchema = z.object({
  id: z.uuid('INVALID_PRODUCT_ID')
})
