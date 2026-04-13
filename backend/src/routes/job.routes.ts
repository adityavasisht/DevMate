import { Router } from 'express'
import { getAllJobs, getJobById, createJob, deleteJob } from '../controllers/job.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'

const router = Router()

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job postings
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get('/', getAllJobs)

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.get('/:id', getJobById)

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a job posting (COMPANY only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - skills
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Developer
 *               description:
 *                 type: string
 *                 example: Looking for a Node.js developer for our fintech startup
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, TypeScript, PostgreSQL]
 *               salary:
 *                 type: string
 *                 example: 40000-60000
 *               location:
 *                 type: string
 *                 example: Bangalore
 *     responses:
 *       201:
 *         description: Job created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only companies can post jobs
 */
router.post('/', authenticate, requireRole('COMPANY'), createJob)

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job posting (COMPANY only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted
 *       403:
 *         description: Can only delete your own jobs
 *       404:
 *         description: Job not found
 */
router.delete('/:id', authenticate, requireRole('COMPANY'), deleteJob)

export default router