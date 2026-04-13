import * as profileService from '../../services/profile.service'

const mockFindUnique = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()

jest.mock('../../config/db', () => ({
  __esModule: true,
  default: {
    profile: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      findMany: jest.fn(),
      create: (...args: any[]) => mockCreate(...args),
      update: (...args: any[]) => mockUpdate(...args),
    },
  },
}))

describe('Profile Service', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createProfile', () => {

    it('should create a profile successfully', async () => {
      const mockProfile = {
        id: 'profile-123',
        userId: 'user-123',
        name: 'Aditya Vasisht',
        bio: 'Full stack developer',
        skills: ['Node.js', 'React'],
        experience: 1,
        github: null,
        portfolio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockFindUnique.mockResolvedValue(null)
      mockCreate.mockResolvedValue(mockProfile)

      const result = await profileService.createProfile('user-123', {
        name: 'Aditya Vasisht',
        skills: ['Node.js', 'React'],
        experience: 1,
      })

      expect(result).toEqual(mockProfile)
      expect(mockCreate).toHaveBeenCalledTimes(1)
    })

    it('should throw PROFILE_EXISTS when profile already exists', async () => {
      mockFindUnique.mockResolvedValue({
        id: 'existing-profile',
        userId: 'user-123',
      })

      await expect(
        profileService.createProfile('user-123', {
          name: 'Aditya',
          skills: ['Node.js'],
        })
      ).rejects.toThrow('PROFILE_EXISTS')
    })

  })

  describe('updateProfile', () => {

    it('should throw PROFILE_NOT_FOUND when profile does not exist', async () => {
      mockFindUnique.mockResolvedValue(null)

      await expect(
        profileService.updateProfile('user-123', { name: 'New Name' })
      ).rejects.toThrow('PROFILE_NOT_FOUND')
    })

    it('should update profile when it exists', async () => {
      const existingProfile = {
        id: 'profile-123',
        userId: 'user-123',
        name: 'Old Name',
        skills: ['Node.js'],
        experience: 0,
      }

      const updatedProfile = { ...existingProfile, name: 'New Name' }

      mockFindUnique.mockResolvedValue(existingProfile)
      mockUpdate.mockResolvedValue(updatedProfile)

      const result = await profileService.updateProfile('user-123', {
        name: 'New Name',
      })

      expect(result.name).toBe('New Name')
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    })

  })

})