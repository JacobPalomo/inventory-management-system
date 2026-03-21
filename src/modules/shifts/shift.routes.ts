import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { Role } from '@prisma/client'
import {
	createShift,
	deleteShift,
	getShifts,
	updateShift,
} from './shift.controller'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Obtener turnos con paginación y filtros
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Shifts]
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
 *         example: Matutino
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Lista paginada de turnos
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               meta:
 *                 total: 0
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 0
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.get('/', authorizeRoles(Role.EDITOR, Role.ADMIN), getShifts)

router.use(authorizeRoles(Role.ADMIN))

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Crear nuevo turno
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [Shifts]
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
 *               - startTime
 *               - endTime
 *             properties:
 *               name:
 *                 type: string
 *                 example: Matutino
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "16:30"
 *           example:
 *             name: Matutino
 *             startTime: 08:00
 *             endTime: 16:30
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.post('/', createShift)

/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Actualizar turno
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: [ADMIN]
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
 *                 example: 1er Turno Matutino
 *               startTime:
 *                 type: string
 *                 example: "00:00"
 *               endTime:
 *                 type: string
 *                 example: "06:00"
 *               isActive:
 *                 type: boolean
 *                 example: false
 *           example:
 *             startTime: 00:00
 *             endTime: 06:00
 *             isActive: false
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         $ref: '#/components/responses/InvalidBodyError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.put('/:id', updateShift)

/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Eliminar turno
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: [ADMIN]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.delete('/:id', deleteShift)

export default router
