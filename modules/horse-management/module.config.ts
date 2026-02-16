import type { ModuleConfig } from '@lib/core'

export const moduleConfig: ModuleConfig = {
  id: 'horse-management',
  name: 'Horse Management',
  version: '1.0.0',
  description: 'Create and manage horse profiles with health records, documents, and owner info',
  tier: 'core',
  enabled: true,

  dependencies: {
    required: ['kernel/entities', 'kernel/events', 'kernel/tenancy'],
    optional: []
  },

  routes: {
    prefix: '/api/horses',
    handlers: [
      'POST /',
      'GET /',
      'GET /:id',
      'PATCH /:id',
      'DELETE /:id',
      'GET /:id/health',
      'POST /:id/health',
      'PATCH /:id/health/:recordId',
      'GET /:id/documents',
      'POST /:id/documents',
      'DELETE /:id/documents/:docId',
      'GET /:id/medications',
      'GET /alerts'
    ]
  },

  tables: ['horses', 'health_records', 'horse_documents'],

  events: [
    'horses:created',
    'horses:updated',
    'horses:archived',
    'horses:health-record-added',
    'horses:document-uploaded'
  ],

  featureFlags: {
    'horses:enabled': true,
    'horses:health-records': true,
    'horses:document-upload': true,
    'horses:expiration-alerts': true
  },

  permissions: {
    'horses:create': 'Barn Manager',
    'horses:read': 'Barn Manager, Groom, Trainer',
    'horses:edit': 'Barn Manager, Trainer',
    'horses:delete': 'Barn Owner',
    'horses:view-health': 'Barn Manager, Veterinarian'
  },

  ui: {
    mainNavigation: {
      label: 'Horses',
      path: '/horses',
      icon: 'horse'
    },
    routes: [
      { path: '/horses', component: 'HorseListPage' },
      { path: '/horses/:id', component: 'HorseDetailPage' },
      { path: '/horses/new', component: 'HorseIntakePage' }
    ]
  }
}
