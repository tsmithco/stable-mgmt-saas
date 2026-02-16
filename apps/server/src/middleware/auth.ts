/**
 * Mock authentication middleware
 * Provides basic auth context for development
 */

import { FastifyRequest, FastifyReply } from 'fastify'

export interface AuthContext {
  userId: string
  orgId: string
  role: 'admin' | 'user'
}

// Augment Fastify module
declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext
  }
}

export async function mockAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Mock authentication - in production, this would validate JWT tokens
  // For now, extract from headers or use default mock values

  const userId = request.headers['x-user-id'] as string || 'mock-user-123'
  const orgId = request.headers['x-org-id'] as string || 'mock-org-456'
  const role = (request.headers['x-role'] as 'admin' | 'user') || 'user'

  request.auth = {
    userId,
    orgId,
    role
  }
}
