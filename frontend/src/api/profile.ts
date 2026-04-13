import api from './axios'
import { Profile } from '../types'

export const getMyProfileApi = async (): Promise<Profile> => {
  const response = await api.get<{ profile: Profile }>('/api/profiles/me')
  return response.data.profile
}

export const createProfileApi = async (data: {
  name: string
  bio?: string
  skills: string[]
  experience: number
  github?: string
  portfolio?: string
}): Promise<Profile> => {
  const response = await api.post<{ profile: Profile }>('/api/profiles', data)
  return response.data.profile
}

export const updateProfileApi = async (data: {
  name?: string
  bio?: string
  skills?: string[]
  experience?: number
  github?: string
  portfolio?: string
}): Promise<Profile> => {
  const response = await api.put<{ profile: Profile }>('/api/profiles', data)
  return response.data.profile
}