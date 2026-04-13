export interface RegisterBody {
  email: string
  password: string
  role: 'DEVELOPER' | 'COMPANY'
}

export interface LoginBody {
  email: string
  password: string
}

export interface JWTPayload {
  userId: string
  role: 'DEVELOPER' | 'COMPANY'
}