import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core'

export const horses = pgTable('horses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: text('org_id').notNull(),
  name: text('name').notNull(),
  breed: text('breed').notNull(),
  age: integer('age').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Horse = typeof horses.$inferSelect
export type NewHorse = typeof horses.$inferInsert
