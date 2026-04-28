import { Request, Response } from 'express'
import * as matchService from '../services/match.service'


export const matchForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string
    const userId = req.user!.userId

    const matches = await matchService.matchDevelopersToJob(jobId, userId)

    res.status(200).json({
      message: `Found ${matches.length} matches`,
      matches
    })
  } catch (error: any) {
    if (error.message === 'JOB_NOT_FOUND') {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    if (error.message === 'UNAUTHORIZED') {
      res.status(403).json({ message: 'You can only match for your own jobs' })
      return
    }
    console.error('Match for job error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


export const getJobMatches = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string
    const userId = req.user!.userId

    const matches = await matchService.getMatchesForJob(jobId, userId)

    res.status(200).json({ matches })
  } catch (error: any) {
    if (error.message === 'JOB_NOT_FOUND') {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    if (error.message === 'UNAUTHORIZED') {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    console.error('Get job matches error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


export const getMyMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId

    const matches = await matchService.getMatchesForDeveloper(userId)

    res.status(200).json({ matches })
  } catch (error: any) {
    if (error.message === 'PROFILE_NOT_FOUND') {
      res.status(404).json({ message: 'Profile not found. Create a profile first.' })
      return
    }
    console.error('Get my matches error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
