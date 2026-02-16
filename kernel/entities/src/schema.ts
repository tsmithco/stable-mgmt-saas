/**
 * Core entity schema definitions
 * Using Drizzle ORM for type-safe schema
 */

import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  bigint,
  integer,
  jsonb,
  date
} from 'drizzle-orm/pg-core'

/**
 * Organizations - top-level tenant
 */
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  subscription_tier: text('subscription_tier').notNull().default('free'), // free, pro, enterprise
  max_horses: integer('max_horses').notNull().default(5),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
})

/**
 * Users - authentication & authorization
 */
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // Supabase UUID
  email: text('email').notNull().unique(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
})

/**
 * User-Organization memberships with role-based access
 */
export const user_org_memberships = pgTable('user_org_memberships', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  org_id: integer('org_id').notNull(),
  role: text('role').notNull(), // owner, manager, trainer, groom, accountant
  joined_at: timestamp('joined_at').notNull().defaultNow(),

  // Foreign keys would be defined in migrations
})

/**
 * Horses - core data model
 */
export const horses = pgTable('horses', {
  id: serial('id').primaryKey(),
  org_id: integer('org_id').notNull(),

  // Identification
  registered_name: text('registered_name').notNull(),
  barn_name: text('barn_name').notNull(),
  breed: text('breed'),
  color: text('color'),
  markings: text('markings'),
  sex: text('sex').notNull(), // mare, stallion, gelding
  dob: date('dob'),
  height_hands: integer('height_hands'),
  weight_lbs: integer('weight_lbs'),

  // Status
  status: text('status').notNull().default('active'), // active, boarding, in-training, archived
  discipline: text('discipline'),
  special_needs: text('special_needs'),

  // Ownership
  owner_name: text('owner_name'),
  owner_email: text('owner_email'),
  owner_phone: text('owner_phone'),
  owner_emergency_contact: text('owner_emergency_contact'),
  owner_emergency_phone: text('owner_emergency_phone'),

  // Insurance
  insurance_carrier: text('insurance_carrier'),
  insurance_policy_number: text('insurance_policy_number'),
  insurance_expiry: date('insurance_expiry'),

  // Metadata
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  created_by: varchar('created_by', { length: 255 }).notNull()
})

/**
 * Stalls - physical locations
 */
export const stalls = pgTable('stalls', {
  id: serial('id').primaryKey(),
  org_id: integer('org_id').notNull(),

  // Identification
  stall_number: text('stall_number').notNull(),
  building_location: text('building_location'),
  barn_section: text('barn_section'),

  // Type & capabilities
  stall_type: text('stall_type').notNull(), // standard, foaling, isolation, stallion-safe, run-in
  size: text('size'), // standard, large, extra-large
  bedding_type: text('bedding_type'),

  // Status
  status: text('status').notNull().default('available'), // available, occupied, maintenance, cleaning
  position: jsonb('position'), // { x: 0, y: 0 }

  // Metadata
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
})

/**
 * Type exports for use throughout the system
 */
export type Organization = typeof organizations.$inferSelect
export type User = typeof users.$inferSelect
export type UserOrgMembership = typeof user_org_memberships.$inferSelect
export type Horse = typeof horses.$inferSelect
export type Stall = typeof stalls.$inferSelect
