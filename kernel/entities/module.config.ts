import type { ModuleConfig } from '@lib/core'

export const moduleConfig: ModuleConfig = {
  id: 'kernel/entities',
  name: 'Core Entities',
  version: '1.0.0',
  description: 'Foundational data models: Organizations, Users, Horses, Stalls',
  tier: 'kernel',
  enabled: true,

  dependencies: {
    required: ['kernel/tenancy'],
    optional: []
  },

  routes: {
    prefix: '/api/entities',
    handlers: []
  },

  tables: ['organizations', 'users', 'horses', 'stalls'],

  events: ['entities:created', 'entities:updated', 'entities:deleted'],

  featureFlags: {
    'entities:enabled': true
  },

  permissions: {
    'entities:read': 'Organization Member'
  }
}
