import type { ModuleConfig } from '@lib/core'

export const moduleConfig: ModuleConfig = {
  id: 'kernel/tenancy',
  name: 'Multi-Tenancy & Data Isolation',
  version: '1.0.0',
  description: 'Multi-tenant data isolation via RLS policies and org context',
  tier: 'kernel',
  enabled: true,

  dependencies: {
    required: ['kernel/auth'],
    optional: []
  },

  routes: {
    prefix: '/api/orgs',
    handlers: [
      'GET /',
      'GET /:id',
      'POST /invite',
      'GET /:id/members',
      'PATCH /:id/members/:userId'
    ]
  },

  tables: ['organizations', 'user_org_memberships'],

  events: ['tenancy:org-created', 'tenancy:user-invited', 'tenancy:org-archived'],

  featureFlags: {
    'tenancy:rls-enabled': true
  },

  permissions: {
    'tenancy:read': 'Organization Member',
    'tenancy:invite': 'Organization Manager',
    'tenancy:manage': 'Organization Owner'
  }
}
