/**
 * Auth route handlers
 */

import type { FastifyRequest, FastifyReply } from 'fastify'

export async function createAuthHandler(fastify: any) {
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    // TODO: Implement Supabase login
    reply.send({
      token: 'mock-jwt-token',
      user: {
        id: 'user-123',
        email: 'test@example.com'
      }
    })
  })

  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    // TODO: Return authenticated user info
    reply.send({
      id: 'user-123',
      email: 'test@example.com'
    })
  })

  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ success: true })
  })
}
