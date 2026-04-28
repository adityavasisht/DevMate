import { Request, Response } from 'express'
import * as applicationService from '../services/application.service'


export const applyToJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string
    const userId = req.user!.userId

    const application = await applicationService.applyToJob(userId, jobId)

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    })
  } catch (error: any) {
    if (error.message === 'PROFILE_NOT_FOUND') {
      res.status(404).json({ message: 'Create a profile before applying' })
      return
    }
    if (error.message === 'ALREADY_APPLIED') {
      res.status(409).json({ message: 'You have already applied to this job' })
      return
    }
    if (error.message === 'JOB_NOT_FOUND') {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    console.error('Apply to job error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string
    const userId = req.user!.userId

    const applications = await applicationService.getApplicationsForJob(jobId, userId)

    res.status(200).json({ applications })
  } catch (error: any) {
    if (error.message === 'JOB_NOT_FOUND') {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    if (error.message === 'UNAUTHORIZED') {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    console.error('Get job applications error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId

    const applications = await applicationService.getMyApplications(userId)

    res.status(200).json({ applications })
  } catch (error: any) {
    console.error('Get my applications error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
