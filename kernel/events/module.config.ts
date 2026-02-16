import type { ModuleConfig } from '@lib/core'

export const moduleConfig: ModuleConfig = {
  id: 'kernel/events',
  name: 'Event Bus',
  version: '1.0.0',
  description: 'Pub/sub event system for inter-module communication',
  tier: 'kernel',
  enabled: true,

  dependencies: {
    required: [],
    optional: []
  },

  routes: {
    prefix: '',
    handlers: []
  },

  tables: [],

  events: [],

  featureFlags: {
    'events:enabled': true
  }
}
