/**
 * Horse Management Module Tests
 */

import { describe, it, expect } from 'vitest'
import { moduleConfig } from '../../module.config'

describe('Horse Management Module Config', () => {
  it('has valid module metadata', () => {
    expect(moduleConfig.id).toBe('horse-management')
    expect(moduleConfig.name).toBe('Horse Management')
    expect(moduleConfig.tier).toBe('core')
    expect(moduleConfig.enabled).toBe(true)
  })

  it('declares required dependencies', () => {
    expect(moduleConfig.dependencies?.required).toContain('kernel/entities')
    expect(moduleConfig.dependencies?.required).toContain('kernel/events')
    expect(moduleConfig.dependencies?.required).toContain('kernel/tenancy')
  })

  it('declares API routes', () => {
    expect(moduleConfig.routes?.prefix).toBe('/api/horses')
    expect(moduleConfig.routes?.handlers).toContain('GET /')
    expect(moduleConfig.routes?.handlers).toContain('POST /')
  })

  it('declares tables', () => {
    expect(moduleConfig.tables).toContain('horses')
    expect(moduleConfig.tables).toContain('health_records')
    expect(moduleConfig.tables).toContain('horse_documents')
  })

  it('declares events', () => {
    expect(moduleConfig.events).toContain('horses:created')
    expect(moduleConfig.events).toContain('horses:health-record-added')
  })

  it('declares feature flags', () => {
    expect(moduleConfig.featureFlags?.['horses:enabled']).toBe(true)
  })
})
