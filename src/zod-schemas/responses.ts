import { z } from 'zod'
import { supplierSchema } from './suppliers.js'

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
