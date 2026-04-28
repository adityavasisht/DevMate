import prisma from '../config/db'

export const findCandidateProfiles = async (limit: number = 5) => {
  const profiles = await prisma.profile.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return profiles
}
