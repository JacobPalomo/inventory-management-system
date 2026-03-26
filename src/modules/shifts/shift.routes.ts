/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: Gestión de turnos
 */

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
 *
 *     description: |
 *       Retorna una lista de turnos con paginación y filtros.
 *
 *       - Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *
 *     tags: [Shifts]
 *
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página (mayor que 0)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         description: Cantidad de registros por página (mayor que 0)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *       - in: query
 *         name: search
 *         description: Permite filtrar por nombre de turno
 *         schema:
 *           type: string
 *         example: Matutino
 *
 *       - in: query
 *         name: isActive
 *         description: Permite filtrar por el estatus de turno (activo o inactivo)
 *         schema:
 *           type: boolean
 *         example: true
 *
 *     responses:
 *       200:
 *         description: Lista paginada de turnos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedShifts'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
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
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
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
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/ShiftNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'El turno eliminado correctamente'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/ShiftNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.delete('/:id', deleteShift)

export default router
