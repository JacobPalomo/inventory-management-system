/**
 * @swagger
 * tags:
 *   name: Movements
 *   description: Movimientos de inventario
 */

import { Router } from 'express'
import { createEntry, createExit, getMovements } from './movement.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { movementRateLimiter } from '../../middlewares/rateLimit.middleware'

const router = Router()

router.use([authMiddleware, movementRateLimiter])

/**
 * @swagger
 * /api/movements/in:
 *   post:
 *     summary: Registrar entrada de inventario
 *     description: |
 *       Registra una entrada manual de inventario, actualiza el stock del producto
 *       y deja un snapshot del costo usado para el movimiento.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               cost:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *               reason:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *           example:
 *             productId: 5967fd31-25d6-457f-b14c-fd8ff59970f2
 *             quantity: 12
 *             cost: 215.5
 *             reason: Recepción de proveedor
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movement:
 *                   $ref: '#/components/schemas/Movement'
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Conflicto de inventario
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/in', authorizeRoles('ADMIN', 'EDITOR'), createEntry)

/**
 * @swagger
 * /api/movements/out:
 *   post:
 *     summary: Registrar salida de inventario
 *     description: |
 *       Registra una salida manual de inventario y valida reglas de stock,
 *       productos no inventariables y permisos del usuario autenticado.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               cost:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *               reason:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *           example:
 *             productId: 964a9123-976b-4cc2-bff4-ca1a2c0752f5
 *             quantity: 2
 *             cost: 145.9
 *             reason: Ajuste por merma
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movement:
 *                   $ref: '#/components/schemas/Movement'
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Conflicto de inventario
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/out', authorizeRoles('ADMIN', 'EDITOR'), createExit)

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener historial de movimientos
 *     description: |
 *       Obtiene el historial de movimientos con paginación y filtros por producto,
 *       usuario, tipo, texto libre y rango de fechas.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         description: Busca por nombre, SKU, barcode, razón o usuario
 *         schema:
 *           type: string
 *       - in: query
 *         name: movementType
 *         schema:
 *           $ref: '#/components/schemas/MovementType'
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dateFrom
 *         description: Fecha inicial en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         description: Fecha final en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista paginada de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovements'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getMovements)

export default router
