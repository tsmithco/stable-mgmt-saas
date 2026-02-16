// Re-export database client from root
// This delegates to PostgreSQL via Drizzle ORM or falls back to in-memory

export { db, type DatabaseAdapter } from '../../../db/client.js'
export type { Horse, NewHorse } from '../../../db/client.js'
