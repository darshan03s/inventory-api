import { asc, desc, eq } from 'drizzle-orm'
import { db } from './index.js'
import { refreshTokens, users } from './schema.js'

type UpdateUserInput = {
  name?: string
  email?: string
  passwordHash?: string
}

export const UserRepository = {
  create: async (data: { name: string; email: string; passwordHash: string }) => {
    const [user] = await db.insert(users).values(data).returning()

    return user
  },

  getById: async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

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

  updateById: async (id: string, data: UpdateUserInput) => {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning()

    return updatedUser
  },

  deleteById: async (id: string) => {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning()

    return deletedUser
  }
}

export const RefreshTokenRepository = {
  create: async (data: { userId: string; token: string; expiresAt: Date }) => {
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
  }
}
