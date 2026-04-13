import api from './axios'
import { Match } from '../types'

export const getMyMatchesApi = async (): Promise<Match[]> => {
  const response = await api.get<{ matches: Match[] }>('/api/matches/me')
  return response.data.matches
}

export const getJobMatchesApi = async (jobId: string): Promise<Match[]> => {
  const response = await api.get<{ matches: Match[] }>(`/api/matches/job/${jobId}`)
  return response.data.matches
}