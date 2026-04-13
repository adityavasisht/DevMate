import * as jobService from '../../services/job.service'

const mockFindUnique = jest.fn()
const mockCreate = jest.fn()
const mockDelete = jest.fn()

jest.mock('../../config/db', () => ({
  __esModule: true,
  default: {
    job: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      findMany: jest.fn(),
      create: (...args: any[]) => mockCreate(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
  },
}))

describe('Job Service', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createJob', () => {

    it('should create a job successfully', async () => {
      const mockJob = {
        id: 'job-123',
        userId: 'company-123',
        title: 'Backend Developer',
        description: 'Looking for Node.js dev',
        skills: ['Node.js', 'TypeScript'],
        salary: '40000-60000',
        location: 'Bangalore',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCreate.mockResolvedValue(mockJob)

      const result = await jobService.createJob('company-123', {
        title: 'Backend Developer',
        description: 'Looking for Node.js dev',
        skills: ['Node.js', 'TypeScript'],
        salary: '40000-60000',
        location: 'Bangalore',
      })

      expect(result).toEqual(mockJob)
      expect(mockCreate).toHaveBeenCalledTimes(1)
    })

  })

  describe('deleteJob', () => {

    it('should throw JOB_NOT_FOUND when job does not exist', async () => {
      mockFindUnique.mockResolvedValue(null)

      await expect(
        jobService.deleteJob('job-123', 'company-123')
      ).rejects.toThrow('JOB_NOT_FOUND')
    })

    it('should throw UNAUTHORIZED when user does not own the job', async () => {
      mockFindUnique.mockResolvedValue({
        id: 'job-123',
        userId: 'different-company',
      })

      await expect(
        jobService.deleteJob('job-123', 'company-123')
      ).rejects.toThrow('UNAUTHORIZED')
    })

    it('should delete job when user owns it', async () => {
      mockFindUnique.mockResolvedValue({
        id: 'job-123',
        userId: 'company-123',
      })
      mockDelete.mockResolvedValue({})

      const result = await jobService.deleteJob('job-123', 'company-123')

      expect(result).toBe(true)
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

  })

})