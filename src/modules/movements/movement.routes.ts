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

const router = Router()

router.use(authMiddleware)

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
 */
router.get('/', getMovements)

export default router
