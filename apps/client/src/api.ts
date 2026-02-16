import axios from 'axios'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '/api'

// Mock auth context - in production, would use real tokens
const orgId = localStorage.getItem('orgId') || 'org-456'
const userId = localStorage.getItem('userId') || 'user-123'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-org-id': orgId,
    'x-user-id': userId
  }
})

export interface Horse {
  id: string
  name: string
  breed: string
  age: number
  color: string
  orgId: string
}

export interface HorseCreateInput {
  name: string
  breed: string
  age: number
  color?: string
}

export const horses = {
  list: () => api.get<{ data: Horse[]; count: number }>('/api/horses'),
  get: (id: string) => api.get<{ data: Horse }>(`/api/horses/${id}`),
  create: (data: HorseCreateInput) =>
    api.post<{ data: Horse; message: string }>('/api/horses', data),
  update: (id: string, data: Partial<HorseCreateInput>) =>
    api.put<{ data: Horse; message: string }>(`/api/horses/${id}`, data),
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/horses/${id}`)
}

export const setOrgContext = (newOrgId: string, newUserId: string) => {
  localStorage.setItem('orgId', newOrgId)
  localStorage.setItem('userId', newUserId)
  api.defaults.headers['x-org-id'] = newOrgId
  api.defaults.headers['x-user-id'] = newUserId
}
