import prisma from '../config/db'

// Get all jobs
export const getAllJobs = async () => {
  const jobs = await prisma.job.findMany({
    include: {
      user: {
        select: {
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return jobs
}

// Get job by id
export const getJobById = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  })

  return job
}

// Create a job
export const createJob = async (
  userId: string,
  data: {
    title: string
    description: string
    skills: string[]
    salary?: string
    location?: string
  }
) => {
  const job = await prisma.job.create({
    data: {
      userId,
      ...data
    }
  })

  return job
}

// Delete a job
export const deleteJob = async (jobId: string, userId: string) => {
  // Find the job first
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) {
    throw new Error('JOB_NOT_FOUND')
  }

  // Make sure the job belongs to this user
  if (job.userId !== userId) {
    throw new Error('UNAUTHORIZED')
  }

  await prisma.job.delete({
    where: { id: jobId }
  })

  return true
}