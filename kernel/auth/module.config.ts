import type { ModuleConfig } from '@lib/core'

export const moduleConfig: ModuleConfig = {
  id: 'kernel/auth',
  name: 'Authentication & Authorization',
  version: '1.0.0',
  description: 'Supabase Auth integration with JWT verification and role-based access control',
  tier: 'kernel',
  enabled: true,

  dependencies: {
    required: [],
    optional: []
  },

  routes: {
    prefix: '/api/auth',
    handlers: ['POST /login', 'POST /logout', 'GET /me', 'POST /refresh-token']
  },

  tables: [],

  events: ['auth:user-created', 'auth:user-logged-in', 'auth:user-logged-out'],

  featureFlags: {
    'auth:enabled': true
  },

  permissions: {
    'auth:read': 'Any',
    'auth:logout': 'Any'
  }
}
