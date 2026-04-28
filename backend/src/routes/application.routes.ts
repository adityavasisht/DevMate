import { Router } from 'express'
import { applyToJob, getJobApplications, getMyApplications } from '../controllers/application.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'

const router = Router()


router.post('/:jobId', authenticate, requireRole('DEVELOPER'), applyToJob)


router.get('/me', authenticate, requireRole('DEVELOPER'), getMyApplications)


router.get('/job/:jobId', authenticate, requireRole('COMPANY'), getJobApplications)

export default router
