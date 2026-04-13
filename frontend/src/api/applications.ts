import api from './axios'
import type { Application } from '../types'

export const applyToJobApi = async (jobId: string): Promise<Application> => {
  const response = await api.post<{ application: Application }>(`/api/applications/${jobId}`)
  return response.data.application
}

export const getMyApplicationsApi = async (): Promise<Application[]> => {
  const response = await api.get<{ applications: Application[] }>('/api/applications/me')
  return response.data.applications
}

export const getJobApplicationsApi = async (jobId: string): Promise<Application[]> => {
  const response = await api.get<{ applications: Application[] }>(`/api/applications/job/${jobId}`)
  return response.data.applications
}