import { z } from 'zod'
import { supplierSchema } from './suppliers.js'
import { productSchema } from './products.js'

export const codeResponseSchema = z.object({
  code: z.string()
})

export const authLoginResponseSchema = z.object({
  accessToken: z.jwt(),
  user: z.object({
    name: z.string(),
    email: z.email(),
    createdAt: z.date()
  })
})

export const authRefreshResponseSchema = z.object({
  accessToken: z.jwt()
})

export const authMeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),

  supplier: z
    .object({
      id: z.string(),
      companyName: z.string()
    })
    .nullable()
})

export const createSupplierResponseSchema = z.object({
  code: z.string(),
  supplier: supplierSchema
})

export const getSupplierResponseSchema = z.object({
  supplier: supplierSchema
})

export const createProductResponseSchema = z.object({
  code: z.string(),
  product: productSchema.pick({
    id: true,
    name: true,
    sku: true,
    price: true,
    stockQuantity: true,
    createdAt: true
  })
})

export const updateProductResponseSchema = z.object({
  code: z.string(),
  product: productSchema.pick({
    id: true,
    name: true,
    sku: true,
    price: true,
    stockQuantity: true,
    createdAt: true,
    updatedAt: true
  })
})

export const getProductResponseSchema = z.object({
  product: productSchema
})

export const getProductsResponseSchema = z.object({
  products: z.array(productSchema)
})
