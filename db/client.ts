// Database client with fallback to in-memory storage
// Set DATABASE_URL to use PostgreSQL, otherwise uses in-memory storage

import type { Horse, NewHorse } from './schema.js'

export interface DatabaseAdapter {
  listHorsesByOrg(orgId: string): Promise<Horse[]>
  createHorse(data: NewHorse): Promise<Horse>
  getHorse(id: string): Promise<Horse | undefined>
  updateHorse(id: string, data: Partial<Horse>): Promise<Horse | undefined>
  deleteHorse(id: string): Promise<boolean>
}

// In-memory implementation for development
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

// For now, always use memory adapter (PostgreSQL setup is manual)
export const db: DatabaseAdapter = memoryAdapter

export type Database = typeof db
