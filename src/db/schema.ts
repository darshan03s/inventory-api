import { relations } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

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

export const usersRelations = relations(users, ({ one }) => ({
  supplier: one(suppliers)
}))

export const suppliersRelations = relations(suppliers, ({ one }) => ({
  user: one(users, {
    fields: [suppliers.userId],
    references: [users.id]
  })
}))

export const products = pgTable(
  'products',
  {
    id: uuid().defaultRandom().primaryKey(),

    supplierId: uuid()
      .notNull()
      .references(() => suppliers.id, {
        onDelete: 'cascade'
      }),

    name: text().notNull(),

    description: text().notNull(),

    sku: text().notNull(),

    price: integer().notNull(),

    stockQuantity: integer().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [
    uniqueIndex('products_sku_index').on(table.sku),
    index('products_supplier_id_index').on(table.supplierId)
  ]
)
