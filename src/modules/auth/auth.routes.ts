/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

import { Router } from 'express'
import { login } from './auth.controller'
import { authRateLimiter } from '../../middlewares/rateLimit.middleware'

const router = Router()

router.use(authRateLimiter)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticación de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@test.com
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidCredentialsError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.post('/login', login)

export default router
