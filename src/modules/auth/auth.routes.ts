/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

import { Router } from 'express'
import { register, login } from './auth.controller'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
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

router.use(authMiddleware)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Jacob
 *             email: jacob@test.com
 *             password: "123456"
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.post('/register', authorizeRoles('ADMIN'), register)

export default router
