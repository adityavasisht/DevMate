import { Router } from 'express'
import { applyToJob, getJobApplications, getMyApplications } from '../controllers/application.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'

const router = Router()

// Developer applies to a job
router.post('/:jobId', authenticate, requireRole('DEVELOPER'), applyToJob)

// Developer sees all their applications
router.get('/me', authenticate, requireRole('DEVELOPER'), getMyApplications)

// Company sees all applicants for a job
router.get('/job/:jobId', authenticate, requireRole('COMPANY'), getJobApplications)

export default router