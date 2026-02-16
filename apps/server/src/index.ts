/**
 * Stable Management SaaS - API Server
 * Fastify-based REST API with module registration and routing
 */

import Fastify from 'fastify'
import { registerHorseManagementRoutes } from './modules/horse-management.js'
import { mockAuthMiddleware } from './middleware/auth.js'

const PORT = 3000
const HOST = '0.0.0.0'

async function main() {
  // Create Fastify server
  const server = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }
  })

  // Register global middleware
  server.addHook('preHandler', mockAuthMiddleware)

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Register module routes
  await registerHorseManagementRoutes(server)

  // Root endpoint
  server.get('/', async (request, reply) => {
    return {
      name: 'Stable Management SaaS',
      version: '0.1.0',
      status: 'running',
      endpoints: {
        health: 'GET /health',
        horses: 'GET /api/horses',
        createHorse: 'POST /api/horses'
      }
    }
  })

  // 404 handler
  server.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`
    })
  })

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    console.error('Error:', error)
    reply.status(500).send({
      error: 'Internal Server Error',
      message: error.message
    })
  })

  try {
    await server.listen({ port: PORT, host: HOST })
    console.log(`✅ Server running at http://${HOST}:${PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
