/**
 * Horse Management schema definitions
 */

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  varchar,
  jsonb
} from 'drizzle-orm/pg-core'

/**
 * Health records for horses
 */
export const health_records = pgTable('health_records', {
  id: serial('id').primaryKey(),
  horse_id: integer('horse_id').notNull(),
  org_id: integer('org_id').notNull(),

  record_type: text('record_type').notNull(), // vaccination, deworming, vet-visit, medication, injury
  record_date: date('record_date').notNull(),
  description: text('description'),
  notes: text('notes'),
  vet_name: text('vet_name'),
  next_due_date: date('next_due_date'),

  // For medications
  medication_name: text('medication_name'),
  dosage: text('dosage'),
  administration_time: text('administration_time'), // 8am, 2pm, 6pm
  prescribing_vet: text('prescribing_vet'),

  // For vaccinations
  vaccine_type: text('vaccine_type'),

  created_at: timestamp('created_at').notNull().defaultNow(),
  created_by: varchar('created_by', { length: 255 }).notNull()
})

/**
 * Horse documents (registrations, insurance, Coggins, health certs)
 */
export const horse_documents = pgTable('horse_documents', {
  id: serial('id').primaryKey(),
  horse_id: integer('horse_id').notNull(),
  org_id: integer('org_id').notNull(),

  document_type: text('document_type').notNull(), // registration, insurance, coggins, health-cert, other
  document_name: text('document_name').notNull(),
  file_url: text('file_url'),
  uploaded_at: timestamp('uploaded_at').notNull().defaultNow(),
  expires_at: date('expires_at'),

  created_by: varchar('created_by', { length: 255 }).notNull()
})

/**
 * Type exports
 */
export type HealthRecord = typeof health_records.$inferSelect
export type HorseDocument = typeof horse_documents.$inferSelect
