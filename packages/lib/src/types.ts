/**
 * Shared type definitions for the entire system
 */

export interface OrgContext {
  id: string
  name: string
  userId: string
  role: 'owner' | 'manager' | 'trainer' | 'groom' | 'accountant'
  permissions: string[]
}

export interface ModuleConfig {
  id: string
  name: string
  version: string
  description: string
  tier: 'kernel' | 'core' | 'extended' | 'integration'
  enabled: boolean

  dependencies?: {
    required: string[]
    optional?: string[]
  }

  routes?: {
    prefix: string
    handlers: string[]
  }

  tables?: string[]

  events?: string[]

  featureFlags?: Record<string, boolean>

  permissions?: Record<string, string>

  ui?: {
    mainNavigation?: {
      label: string
      path: string
      icon: string
    }
    routes?: Array<{
      path: string
      component: string
    }>
  }
}

export interface Horse {
  id: string
  org_id: string
  registered_name: string
  barn_name: string
  breed?: string
  color?: string
  markings?: string
  sex: 'mare' | 'stallion' | 'gelding'
  dob?: Date
  height_hands?: number
  weight_lbs?: number
  status: 'active' | 'boarding' | 'in-training' | 'archived'
  discipline?: string
  special_needs?: string
  owner_name?: string
  owner_email?: string
  owner_phone?: string
  owner_emergency_contact?: string
  owner_emergency_phone?: string
  insurance_carrier?: string
  insurance_policy_number?: string
  insurance_expiry?: Date
  created_at: Date
  updated_at: Date
  created_by: string
}

export interface HealthRecord {
  id: string
  horse_id: string
  org_id: string
  record_type: 'vaccination' | 'deworming' | 'vet-visit' | 'medication' | 'injury'
  record_date: Date
  description?: string
  notes?: string
  vet_name?: string
  next_due_date?: Date
  medication_name?: string
  dosage?: string
  administration_time?: string
  prescribing_vet?: string
  vaccine_type?: string
  created_at: Date
  created_by: string
}

export interface HorseDocument {
  id: string
  horse_id: string
  org_id: string
  document_type: 'registration' | 'insurance' | 'coggins' | 'health-cert' | 'other'
  document_name: string
  file_url?: string
  uploaded_at: Date
  expires_at?: Date
  created_by: string
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
