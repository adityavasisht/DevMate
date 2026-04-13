import { Request, Response } from 'express'
import * as jobService from '../services/job.service'

// GET /api/jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.getAllJobs()
    res.status(200).json({ jobs })
  } catch (error) {
    console.error('Get all jobs error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// GET /api/jobs/:id
export const getJobById = async (req: Request, res: Response) => {
  try {
    const  id   = req.params.id as string

    const job = await jobService.getJobById(id)

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.status(200).json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/jobs
export const createJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId
    const { title, description, skills, salary, location } = req.body

    if (!title || !description || !skills || skills.length === 0) {
      res.status(400).json({ message: 'Title, description and skills are required' })
      return
    }

    const job = await jobService.createJob(userId, {
      title,
      description,
      skills,
      salary,
      location
    })

    res.status(201).json({
      message: 'Job created successfully',
      job
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /api/jobs/:id
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const  id  = req.params.id as string
    const userId = req.user!.userId

    await jobService.deleteJob(id, userId)

    res.status(200).json({ message: 'Job deleted successfully' })
  } catch (error: any) {
    if (error.message === 'JOB_NOT_FOUND') {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    if (error.message === 'UNAUTHORIZED') {
      res.status(403).json({ message: 'You can only delete your own jobs' })
      return
    }
    console.error('Delete job error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}