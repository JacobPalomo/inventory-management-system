/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { Role } from '@prisma/client'
import {
	adminUpdatePassword,
	createUser,
	deleteUser,
	getUsers,
	updateMyPassword,
	updateUser,
} from './user.controller'

const router = Router()

// You need to log in and have the administrator/editor role.
router.use(authMiddleware)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener usuarios con paginación y filtros
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: JAcOb
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *         content:
 *           application/json:
 *             example:
 *               name: Jacob
 *               email: jacob@test.com
 *               password: "123456"
 *               role: VIEWER
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.get('/', authorizeRoles(Role.ADMIN, Role.EDITOR), getUsers)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [ADMIN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *               shiftId:
 *                 type: string
 *           example:
 *             name: Jacob
 *             email: jacob@test.com
 *             password: "123456"
 *             role: VIEWER
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
router.post('/', authorizeRoles(Role.ADMIN), createUser)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modificar un usuario
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     security:
 *       - bearerAuth: [ADMIN]
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *               shiftId:
 *                 type: string
 *           example:
 *             name: Administrator
 *             email: admin@testupdate.com
 *     responses:
 *       200:
 *         description: Usuario modificado
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
router.put('/:id', authorizeRoles(Role.ADMIN), updateUser)

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Modificar la contraseña de un usuario
 *     description: |
 *       Requiere autenticación JWT.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - currentPassword
 *              - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             currentPassword: "123456"
 *             newPassword: "654321"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.patch('/me/password', updateMyPassword)

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Modificar la contraseña de un usuario mediante usuario Administrador
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     security:
 *       - bearerAuth: [ADMIN]
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *           example:
 *             newPassword: "654321"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente por el administrador
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.patch('/:id/password', authorizeRoles(Role.ADMIN), adminUpdatePassword)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     security:
 *       - bearerAuth: [ADMIN]
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             example:
 *               message: Usuario eliminado
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.delete('/:id', authorizeRoles(Role.ADMIN), deleteUser)

export default router
