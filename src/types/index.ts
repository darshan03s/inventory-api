import type z from 'zod'
import type { loginSchema, registerSchema } from '@/zod-schemas/auth.js'
import type { createProductSchema, updateProductSchema } from '@/zod-schemas/products.js'
import type { createSupplierSchema } from '@/zod-schemas/suppliers.js'

export type RegisterUserBody = z.infer<typeof registerSchema>

export type LoginUserBody = z.infer<typeof loginSchema>

export type JwtPayloadData = {
  userId: string
}

export type CreateSupplierBody = z.infer<typeof createSupplierSchema>

export type CreateProductBody = z.infer<typeof createProductSchema>

export type UpdateProductBody = z.infer<typeof updateProductSchema>

export type ProductFilters = {
  supplierId: string

  search?: string
  sku?: string

  minPrice?: number
  maxPrice?: number

  inStock?: boolean

  page?: number
  limit?: number
}
