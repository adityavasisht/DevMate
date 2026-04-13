import prisma from '../config/db'

// Get a profile by userId
export const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          createdAt: true
        }
      }
    }
  })

  return profile
}

// Get all profiles
export const getAllProfiles = async () => {
  const profiles = await prisma.profile.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return profiles
}

// Create a profile
export const createProfile = async (
  userId: string,
  data: {
    name: string
    bio?: string
    skills: string[]
    github?: string
    portfolio?: string
    experience?: number
  }
) => {
  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId }
  })

  if (existingProfile) {
    throw new Error('PROFILE_EXISTS')
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      ...data
    }
  })

  return profile
}

// Update a profile
export const updateProfile = async (
  userId: string,
  data: {
    name?: string
    bio?: string
    skills?: string[]
    github?: string
    portfolio?: string
    experience?: number
  }
) => {
  // Check if profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId }
  })

  if (!existingProfile) {
    throw new Error('PROFILE_NOT_FOUND')
  }

  const profile = await prisma.profile.update({
    where: { userId },
    data
  })

  return profile
}