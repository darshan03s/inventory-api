import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const test = pgTable('test', {
  id: uuid().defaultRandom()
})

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),

  name: text().notNull(),

  email: text().notNull().unique(),

  passwordHash: text().notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade'
    }),

  token: text().notNull().unique(),

  expiresAt: timestamp({ withTimezone: true }).notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})

export const suppliers = pgTable('suppliers', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .unique(),

  phone: text().notNull(),

  companyName: text().notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})
