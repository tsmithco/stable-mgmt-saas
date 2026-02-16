// Database client with PostgreSQL support
// Uses DATABASE_URL environment variable for Supabase connection

import type { Horse, NewHorse } from './schema.js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'
import { eq } from 'drizzle-orm'

// Re-export types for convenience
export type { Horse, NewHorse }

export interface DatabaseAdapter {
  listHorsesByOrg(orgId: string): Promise<Horse[]>
  createHorse(data: NewHorse): Promise<Horse>
  getHorse(id: string): Promise<Horse | undefined>
  updateHorse(id: string, data: Partial<Horse>): Promise<Horse | undefined>
  deleteHorse(id: string): Promise<boolean>
}

// In-memory fallback
const horsesMemory = new Map<string, Horse>()

const memoryAdapter: DatabaseAdapter = {
  listHorsesByOrg: async (orgId: string) => {
    return Array.from(horsesMemory.values()).filter((h) => h.orgId === orgId)
  },
  createHorse: async (data: NewHorse) => {
    const horse: Horse = {
      ...data,
      color: data.color ?? null,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    horsesMemory.set(horse.id, horse)
    return horse
  },
  getHorse: async (id: string) => {
    return horsesMemory.get(id)
  },
  updateHorse: async (id: string, data: Partial<Horse>) => {
    const horse = horsesMemory.get(id)
    if (!horse) return undefined
    const updated = { ...horse, ...data, updatedAt: new Date() }
    horsesMemory.set(id, updated)
    return updated
  },
  deleteHorse: async (id: string) => {
    return horsesMemory.delete(id)
  }
}

// PostgreSQL adapter
let postgresDb: any = null

function createPostgresAdapter(): DatabaseAdapter {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.log('💡 DATABASE_URL not set. Using in-memory storage.')
    return memoryAdapter
  }

  try {
    const client = postgres(connectionString)
    postgresDb = drizzle(client, { schema })
    console.log('✅ Connected to PostgreSQL database')

    return {
      async listHorsesByOrg(orgId: string) {
        return postgresDb
          .select()
          .from(schema.horses)
          .where(eq(schema.horses.orgId, orgId))
      },
      async createHorse(data: NewHorse) {
        const result = await postgresDb
          .insert(schema.horses)
          .values(data)
          .returning()
        return result[0]
      },
      async getHorse(id: string) {
        const result = await postgresDb
          .select()
          .from(schema.horses)
          .where(eq(schema.horses.id, id as any))
        return result[0]
      },
      async updateHorse(id: string, data: Partial<Horse>) {
        const result = await postgresDb
          .update(schema.horses)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.horses.id, id as any))
          .returning()
        return result[0]
      },
      async deleteHorse(id: string) {
        await postgresDb
          .delete(schema.horses)
          .where(eq(schema.horses.id, id as any))
        return true
      }
    }
  } catch (err) {
    console.warn('⚠️  PostgreSQL connection failed, falling back to in-memory')
    console.error(err instanceof Error ? err.message : err)
    return memoryAdapter
  }
}

// Initialize adapter
export const db: DatabaseAdapter = createPostgresAdapter()

export type Database = typeof db
