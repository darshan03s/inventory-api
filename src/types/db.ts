import type { InferSelectModel } from 'drizzle-orm'
import type { products, refreshTokens, suppliers, users } from '@/db/schema.js'

export type User = InferSelectModel<typeof users>

export type CreateUserData = Pick<User, 'name' | 'email' | 'passwordHash'>

export type UpdateUserData = Partial<CreateUserData>

export type RefreshToken = InferSelectModel<typeof refreshTokens>

export type CreateRefreshTokenData = Pick<RefreshToken, 'userId' | 'token' | 'expiresAt'>

export type Supplier = InferSelectModel<typeof suppliers>

export type CreateSupplierData = Pick<Supplier, 'userId' | 'phone' | 'companyName'>

export type UpdateSupplierData = Partial<CreateSupplierData>

export type Product = InferSelectModel<typeof products>

export type CreateProductData = Pick<
  Product,
  'supplierId' | 'name' | 'description' | 'sku' | 'price' | 'stockQuantity'
>

export type UpdateProductData = Partial<CreateProductData>
