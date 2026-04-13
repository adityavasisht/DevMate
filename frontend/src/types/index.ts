export type User = {
  id: string
  email: string
  role: 'DEVELOPER' | 'COMPANY'
}

export type Profile = {
  id: string
  userId: string
  name: string
  bio?: string
  skills: string[]
  experience: number
  github?: string
  portfolio?: string
}

export type Job = {
  id: string
  userId: string
  title: string
  description: string
  skills: string[]
  salary?: string
  location?: string
  createdAt: string
  user?: {
    email: string
  }
}

export type Match = {
  id: string
  score: number
  reasoning: string
  job?: Job
  profile?: Profile
  createdAt: string
}

export type AuthResponse = {
  token: string
  user: User
  message: string
}
export type Application = {
  id: string
  jobId: string
  profileId: string
  status: string
  createdAt: string
  job?: Job
  profile?: Profile
}