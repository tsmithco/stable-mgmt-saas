/**
 * Horse Management Module Routes
 * Registers all horse-related API endpoints
 */

import { FastifyInstance } from 'fastify'
import { db } from '../db.js'

interface HorseInput {
  name: string
  breed: string
  age: number
  color?: string
}

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

    try {
      const horses = await db.listHorsesByOrg(orgId)

      return {
        data: horses,
        count: horses.length
      }
    } catch (err) {
      server.log.error(err)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch horses'
      })
    }
  })

  /**
   * POST /api/horses
   * Create a new horse
   */
  server.post<{ Body: HorseInput }>('/api/horses', async (request, reply) => {
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

    try {
      const newHorse = await db.createHorse({
        name,
        breed,
        age,
        color: color || null,
        orgId
      })

      return reply.status(201).send({
        data: newHorse,
        message: 'Horse created successfully'
      })
    } catch (err) {
      server.log.error(err)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create horse'
      })
    }
  })

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

      try {
        const horse = await db.getHorse(id)

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
      } catch (err) {
        server.log.error(err)
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch horse'
        })
      }
    }
  )

  /**
   * PUT /api/horses/:id
   * Update a horse
   */
  server.put<{ Params: { id: string }; Body: Partial<HorseInput> }>(
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

      try {
        const horse = await db.getHorse(id)

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

        const updated = await db.updateHorse(id, request.body)

        return {
          data: updated,
          message: 'Horse updated successfully'
        }
      } catch (err) {
        server.log.error(err)
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to update horse'
        })
      }
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

      try {
        const horse = await db.getHorse(id)

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

        await db.deleteHorse(id)

        return { message: 'Horse deleted successfully' }
      } catch (err) {
        server.log.error(err)
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to delete horse'
        })
      }
    }
  )
}
