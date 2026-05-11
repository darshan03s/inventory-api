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
