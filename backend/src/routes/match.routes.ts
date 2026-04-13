import { Router } from 'express'
import { matchForJob, getJobMatches, getMyMatches } from '../controllers/match.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'

const router = Router()

/**
 * @swagger
 * /api/matches/me:
 *   get:
 *     summary: Get my matches (DEVELOPER only)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matches for this developer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/me', authenticate, requireRole('DEVELOPER'), getMyMatches)

/**
 * @swagger
 * /api/matches/job/{jobId}:
 *   post:
 *     summary: Run AI matching for a job (COMPANY only)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to match developers against
 *     responses:
 *       200:
 *         description: AI matching completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Found 3 matches
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *       403:
 *         description: Can only match for your own jobs
 *       404:
 *         description: Job not found
 */
router.post('/job/:jobId', authenticate, requireRole('COMPANY'), matchForJob)

/**
 * @swagger
 * /api/matches/job/{jobId}:
 *   get:
 *     summary: Get matches for a job (COMPANY only)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Matches for this job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Job not found
 */
router.get('/job/:jobId', authenticate, requireRole('COMPANY'), getJobMatches)

export default router