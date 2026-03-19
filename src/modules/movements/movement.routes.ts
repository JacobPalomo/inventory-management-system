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
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: uuid-product
 *             quantity: 5
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             example:
 *               movement:
 *                 type: IN
 *                 quantity: 5
 *               product:
 *                 stock: 15
 *       400:
 *         description: Error en datos
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.post('/in', authorizeRoles('ADMIN', 'EDITOR'), createEntry)

/**
 * @swagger
 * /api/movements/out:
 *   post:
 *     summary: Registrar salida de inventario
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: uuid-product
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             example:
 *               movement:
 *                 id: uuid-movement
 *                 type: OUT
 *                 quantity: 2
 *               product:
 *                 id: uuid-product
 *                 stock: 8
 *       400:
 *         description: Stock insuficiente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.post('/out', authorizeRoles('ADMIN', 'EDITOR'), createExit)

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener historial de movimientos
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
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
 *         name: productId
 *         schema:
 *           type: string
 *         example: "123"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: laptop
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [IN, OUT]
 *         required: false
 *         description: Tipo de movimiento (IN = entrada, OUT = salida)
 *         example: IN
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial en formato YYYY-MM-DD (zona horaria local)
 *         example: "2026-03-18"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final en formato YYYY-MM-DD (zona horaria local)
 *         example: "2026-03-19"
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movement'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/ToManyRequestsError'
 */
router.get('/', getMovements)

export default router
