import prisma from '../config/db'


export const applyToJob = async (userId: string, jobId: string) => {

  const profile = await prisma.profile.findUnique({
    where: { userId }
  })

  if (!profile) {
    throw new Error('PROFILE_NOT_FOUND')
  }


  const existingApplication = await prisma.application.findFirst({
    where: {
      jobId,
      profileId: profile.id
    }
  })

  if (existingApplication) {
    throw new Error('ALREADY_APPLIED')
  }


  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  
  if (!job) {
    throw new Error('JOB_NOT_FOUND')
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      profileId: profile.id,
      userId,
      status: 'PENDING'
    }
  })

  return application
}


export const getApplicationsForJob = async (jobId: string, userId: string) => {

  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) throw new Error('JOB_NOT_FOUND')
  if (job.userId !== userId) throw new Error('UNAUTHORIZED')

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      profile: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return applications
}


export const getMyApplications = async (userId: string) => {
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          user: {
            select: { email: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return applications
}
