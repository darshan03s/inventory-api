import { asc, desc, eq } from 'drizzle-orm'
import { db } from './index.js'
import { users } from './schema.js'

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
