/**
 * Kernel Auth Module
 * Handles Supabase authentication and JWT verification
 */

export { moduleConfig } from '../module.config'
export { createAuthHandler } from './handlers'
export { verifyToken, getUser } from './middleware'
