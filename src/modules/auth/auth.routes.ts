/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

import { Router } from 'express'
import { register, login } from './auth.controller'
import { authorizeRoles } from '../../middlewares/role.middleware'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Jacob
 *             email: jacob@test.com
 *             password: 123456
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Usuario ya existe o datos inválidos
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/register', authorizeRoles('ADMIN', 'EDITOR'), register)

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
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidCredentialsError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/login', login)

export default router
