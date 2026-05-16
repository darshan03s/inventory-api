import { and, asc, desc, eq, gte, ilike, lte } from 'drizzle-orm'
import { db } from './index.js'
import { products, refreshTokens, suppliers, users } from './schema.js'
import type {
  CreateProductData,
  CreateRefreshTokenData,
  CreateSupplierData,
  CreateUserData,
  UpdateProductData,
  UpdateUserData
} from '../types/db.js'
import type { ProductFilters } from '../types/index.js'

export const UsersRepository = {
  create: async (data: CreateUserData) => {
    const [user] = await db.insert(users).values(data).returning()

    return user
  },

  getById: async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

    return user
  },

  getByIdWithSupplier: async (userId: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),

      columns: {
        passwordHash: false
      },

      with: {
        supplier: {
          columns: {
            id: true,
            companyName: true
          }
        }
      }
    })

    return user
  },

  getByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    return user
  },

  getAllByCreatedAtAsc: async () => {
    const allUsers = await db.select().from(users).orderBy(asc(users.createdAt))

    return allUsers
  },

  getAllByCreatedAtDesc: async () => {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

    return allUsers
  },

  updateById: async (id: string, data: UpdateUserData) => {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning()

    return updatedUser
  },

  deleteById: async (id: string) => {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning()

    return deletedUser
  }
}

export const RefreshTokenRepository = {
  create: async (data: CreateRefreshTokenData) => {
    const [refreshToken] = await db.insert(refreshTokens).values(data).returning()

    return refreshToken
  },

  getByToken: async (token: string) => {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1)

    return refreshToken
  },

  deleteByToken: async (token: string) => {
    const [deletedRefreshToken] = await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .returning()

    return deletedRefreshToken
  },

  deleteAllByUserId: async (userId: string) => {
    return db.delete(refreshTokens).where(eq(refreshTokens.userId, userId))
  },

  rotate: async (oldRefreshToken: string, newRefreshToken: string, userId: string) => {
    await db.transaction(async (tx) => {
      await tx.delete(refreshTokens).where(eq(refreshTokens.token, oldRefreshToken))

      await tx.insert(refreshTokens).values({
        userId,
        token: newRefreshToken
      })
    })
  }
}

export const SuppliersRepository = {
  create: async (data: CreateSupplierData) => {
    const [supplier] = await db.insert(suppliers).values(data).returning()

    return supplier
  },

  getByUserId: async (userId: string) => {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.userId, userId))
      .limit(1)

    return supplier
  }
}

export const ProductsRepository = {
  create: async (data: CreateProductData) => {
    const [product] = await db.insert(products).values(data).returning()

    return product
  },

  getById: async (id: string) => {
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)

    return product
  },

  getByIdAndSupplierId: async (id: string, supplierId: string) => {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.supplierId, supplierId)))
      .limit(1)

    return product
  },

  updateById: async (id: string, data: UpdateProductData) => {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning()

    return updatedProduct
  },

  deleteById: async (id: string) => {
    const [deletedProduct] = await db.delete(products).where(eq(products.id, id)).returning()

    return deletedProduct
  },

  getMany: async (filters: ProductFilters) => {
    const conditions = [eq(products.supplierId, filters.supplierId)]

    if (filters.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`))
    }

    if (filters.sku) {
      conditions.push(eq(products.sku, filters.sku))
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice))
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice))
    }

    if (filters.inStock) {
      conditions.push(gte(products.stockQuantity, 1))
    }

    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const offset = (page - 1) * limit

    const allProducts = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset)

    return allProducts
  }
}
