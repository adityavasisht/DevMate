import api from './axios'
import { Job } from '../types'

export const getAllJobsApi = async (): Promise<Job[]> => {
  const response = await api.get<{ jobs: Job[] }>('/api/jobs')
  return response.data.jobs
}

export const createJobApi = async (data: {
  title: string
  description: string
  skills: string[]
  salary?: string
  location?: string
}): Promise<Job> => {
  const response = await api.post<{ job: Job }>('/api/jobs', data)
  return response.data.job
}

export const triggerMatchingApi = async (jobId: string) => {
  const response = await api.post(`/api/matches/job/${jobId}`)
  return response.data
}