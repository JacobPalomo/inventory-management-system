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
 *     description: No requiere ningún tipo de autenticación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
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
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/InvalidCredentialsError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/login', login)

export default router
