import { Request, Response } from 'express'
import * as profileService from '../services/profile.service'

// GET /api/profiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await profileService.getAllProfiles()
    res.status(200).json({ profiles })
  } catch (error) {
    console.error('Get all profiles error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// GET /api/profiles/me
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId

    const profile = await profileService.getProfileByUserId(userId)

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' })
      return
    }

    res.status(200).json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/profiles
export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId
    const { name, bio, skills, github, portfolio, experience } = req.body

    if (!name || !skills || skills.length === 0) {
      res.status(400).json({ message: 'Name and skills are required' })
      return
    }

    const profile = await profileService.createProfile(userId, {
      name,
      bio,
      skills,
      github,
      portfolio,
      experience
    })

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    })
  } catch (error: any) {
    if (error.message === 'PROFILE_EXISTS') {
      res.status(409).json({ message: 'Profile already exists' })
      return
    }
    console.error('Create profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/profiles
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId
    const { name, bio, skills, github, portfolio, experience } = req.body

    const profile = await profileService.updateProfile(userId, {
      name,
      bio,
      skills,
      github,
      portfolio,
      experience
    })

    res.status(200).json({
      message: 'Profile updated successfully',
      profile
    })
  } catch (error: any) {
    if (error.message === 'PROFILE_NOT_FOUND') {
      res.status(404).json({ message: 'Profile not found' })
      return
    }
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}