/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Registros de auditoría del sistema
 */

import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { Role } from '@prisma/client'
import { getAuditLogs, getAuditLogsByEntity } from './audit-log.controller'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/audit-logs/audit:
 *   get:
 *     summary: Obtener registros de auditoría con paginación y filtros
 *
 *     description: |
 *       Retorna los registros de auditoría con paginación y filtros.
 *
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *
 *     tags: [AuditLogs]
 *
 *     security:
 *       - bearerAuth: [ADMIN]
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
 *         name: entity
 *         description: Tipo de entidad sobre la que se realizó una acción
 *         schema:
 *           $ref: '#/components/schemas/EntityType'
 *         example: User
 *
 *       - in: query
 *         name: entityId
 *         description: ID de la entidad sobre la que se realizó una acción
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 3ac7886b-521e-486f-ae8c-7126697473ec
 *
 *       - in: query
 *         name: userId
 *         description: ID del usuario que realizó la acción auditable
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 28cc07ea-83c0-459e-9b29-e17a2868e1de
 *
 *       - in: query
 *         name: dateFrom
 *         description: Fecha de inicio del rango para filtrado por fecha
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-03-01
 *
 *       - in: query
 *         name: dateTo
 *         description: Fecha final del rango para filtrado por fecha
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-03-30
 *
 *       - in: query
 *         name: action
 *         description: Tipo de acción realizada
 *         schema:
 *           $ref: '#/components/schemas/AuditAction'
 *         example: UPDATE
 *
 *     responses:
 *       200:
 *         description: Lista paginada de registros de auditoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
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
router.get('/audit', authorizeRoles(Role.ADMIN), getAuditLogs)

/**
 * @swagger
 * /api/audit-logs/audit/{entity}/{id}:
 *   get:
 *     summary: Obtener registros de auditoría por entidad
 *     description: |
 *       Retorna los registros de auditoría asociados a una entidad específica con paginación.
 *
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: entity
 *         description: Tipo de entidad sobre la que se realizó una acción
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/EntityType'
 *
 *       - in: path
 *         name: id
 *         description: ID de la entidad sobre la que se realizó una acción
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *       - in: query
 *         name: page
 *         description: Número de página (mayor que 0)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
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
 *     responses:
 *       200:
 *         description: Lista paginada de registros de auditoría de la entidad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAuditLogs'
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
router.get('/audit/:entity/:id', getAuditLogsByEntity)

export default router
