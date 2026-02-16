/**
 * Horse Management Module Routes
 * Registers all horse-related API endpoints
 */

import { FastifyInstance } from 'fastify'

interface Horse {
  id: string
  name: string
  breed: string
  age: number
  color: string
  orgId: string
}

// In-memory storage for demo (replace with DB in production)
const horses: Map<string, Horse> = new Map()

export async function registerHorseManagementRoutes(server: FastifyInstance) {
  /**
   * GET /api/horses
   * List all horses for the authenticated organization
   */
  server.get('/api/horses', async (request, reply) => {
    const orgId = request.auth?.orgId

    if (!orgId) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'No organization context'
      })
    }

    const orgHorses = Array.from(horses.values()).filter(
      (h) => h.orgId === orgId
    )

    return {
      data: orgHorses,
      count: orgHorses.length
    }
  })

  /**
   * POST /api/horses
   * Create a new horse
   */
  server.post<{ Body: Omit<Horse, 'id' | 'orgId'> }>(
    '/api/horses',
    async (request, reply) => {
      const orgId = request.auth?.orgId

      if (!orgId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'No organization context'
        })
      }

      const { name, breed, age, color } = request.body

      if (!name || !breed || typeof age !== 'number') {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Missing required fields: name, breed, age'
        })
      }

      const id = `horse-${Date.now()}`
      const newHorse: Horse = {
        id,
        name,
        breed,
        age,
        color: color || 'unknown',
        orgId
      }

      horses.set(id, newHorse)

      return reply.status(201).send({
        data: newHorse,
        message: 'Horse created successfully'
      })
    }
  )

  /**
   * GET /api/horses/:id
   * Get a specific horse by ID
   */
  server.get<{ Params: { id: string } }>(
    '/api/horses/:id',
    async (request, reply) => {
      const { id } = request.params
      const orgId = request.auth?.orgId

      if (!orgId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'No organization context'
        })
      }

      const horse = horses.get(id)

      if (!horse) {
        return reply.status(404).send({
          error: 'Not Found',
          message: `Horse with ID ${id} not found`
        })
      }

      if (horse.orgId !== orgId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have access to this horse'
        })
      }

      return { data: horse }
    }
  )

  /**
   * PUT /api/horses/:id
   * Update a horse
   */
  server.put<{ Params: { id: string }; Body: Partial<Omit<Horse, 'id' | 'orgId'>> }>(
    '/api/horses/:id',
    async (request, reply) => {
      const { id } = request.params
      const orgId = request.auth?.orgId

      if (!orgId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'No organization context'
        })
      }

      const horse = horses.get(id)

      if (!horse) {
        return reply.status(404).send({
          error: 'Not Found',
          message: `Horse with ID ${id} not found`
        })
      }

      if (horse.orgId !== orgId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have access to this horse'
        })
      }

      const updated = { ...horse, ...request.body }
      horses.set(id, updated)

      return { data: updated, message: 'Horse updated successfully' }
    }
  )

  /**
   * DELETE /api/horses/:id
   * Delete a horse
   */
  server.delete<{ Params: { id: string } }>(
    '/api/horses/:id',
    async (request, reply) => {
      const { id } = request.params
      const orgId = request.auth?.orgId

      if (!orgId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'No organization context'
        })
      }

      const horse = horses.get(id)

      if (!horse) {
        return reply.status(404).send({
          error: 'Not Found',
          message: `Horse with ID ${id} not found`
        })
      }

      if (horse.orgId !== orgId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have access to this horse'
        })
      }

      horses.delete(id)

      return { message: 'Horse deleted successfully' }
    }
  )
}
