import prisma from '../config/db'

// Find profiles to match against a job
// Without vector search, we just get all profiles
// Gemini will handle the matching logic
export const findCandidateProfiles = async (limit: number = 5) => {
  const profiles = await prisma.profile.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return profiles
}