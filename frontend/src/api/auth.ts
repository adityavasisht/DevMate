import api from './axios'
import { AuthResponse } from '../types'

export const registerApi = async (
  email: string,
  password: string,
  role: 'DEVELOPER' | 'COMPANY'
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', {
    email,
    password,
    role,
  })
  return response.data
}

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  })
  return response.data
}