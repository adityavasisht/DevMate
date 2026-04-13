import { Router } from 'express'
import { getAllProfiles, getMyProfile, createProfile, updateProfile } from '../controllers/profile.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'

const router = Router()

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Get all developer profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 */
router.get('/', getAllProfiles)

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/me', authenticate, getMyProfile)

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Create developer profile (DEVELOPER only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - skills
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aditya Vasisht
 *               bio:
 *                 type: string
 *                 example: Full stack developer from Bangalore
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, React, TypeScript]
 *               experience:
 *                 type: number
 *                 example: 1
 *               github:
 *                 type: string
 *                 example: https://github.com/username
 *               portfolio:
 *                 type: string
 *                 example: https://myportfolio.com
 *     responses:
 *       201:
 *         description: Profile created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only developers can create profiles
 *       409:
 *         description: Profile already exists
 */
router.post('/', authenticate, requireRole('DEVELOPER'), createProfile)

/**
 * @swagger
 * /api/profiles:
 *   put:
 *     summary: Update my profile (DEVELOPER only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.put('/', authenticate, requireRole('DEVELOPER'), updateProfile)

export default router