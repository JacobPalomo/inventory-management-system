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
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
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
 *                 example: d33e6a68-fb52-4260-b245-646e11f1000d
 *               quantity:
 *                 type: number
 *                 example: 5
 *           example:
 *             productId: 5967fd31-25d6-457f-b14c-fd8ff59970f2
 *             quantity: 5
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                       format: MovementType
 *                     quantity:
 *                       type: number
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: ISODateTime
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     stock:
 *                       type: number
 *                     minStock:
 *                       type: number
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: ISODateTime
 *             example:
 *               movement:
 *                 id: 3abb28af-622e-4edb-9bc6-5645e41dc190
 *                 type: IN
 *                 quantity: 5
 *                 productId: a712c711-b498-40dc-a9ad-5ac726bb4d64
 *                 userId: 10b90444-57c1-4d9d-b996-e854bb1f21d6
 *                 createdAt: 2026-03-21T02:44:36.154Z
 *               product:
 *                 id: abe46637-b2ee-4aaf-9d40-d7aa193c22f3
 *                 name: Laptop HP
 *                 description: 16GB RAM
 *                 stock: 15
 *                 minStock: 3
 *                 isActive: true
 *                 createdAt: 2026-03-19T05:00:24.585Z
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
router.post('/in', authorizeRoles('ADMIN', 'EDITOR'), createEntry)

/**
 * @swagger
 * /api/movements/out:
 *   post:
 *     summary: Registrar salida de inventario
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
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
 *                 example: d33e6a68-fb52-4260-b245-646e11f1000d
 *               quantity:
 *                 type: number
 *                 example: 5
 *           example:
 *             productId: 964a9123-976b-4cc2-bff4-ca1a2c0752f5
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                       format: MovementType
 *                     quantity:
 *                       type: number
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: ISODateTime
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     stock:
 *                       type: number
 *                     minStock:
 *                       type: number
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: ISODateTime
 *             example:
 *               movement:
 *                 id: 3abb28af-622e-4edb-9bc6-5645e41dc190
 *                 type: OUT
 *                 quantity: 5
 *                 productId: a712c711-b498-40dc-a9ad-5ac726bb4d64
 *                 userId: 10b90444-57c1-4d9d-b996-e854bb1f21d6
 *                 createdAt: 2026-03-21T02:44:36.154Z
 *               product:
 *                 id: abe46637-b2ee-4aaf-9d40-d7aa193c22f3
 *                 name: Laptop HP
 *                 description: 16GB RAM
 *                 stock: 10
 *                 minStock: 3
 *                 isActive: true
 *                 createdAt: 2026-03-19T05:00:24.585Z
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
router.post('/out', authorizeRoles('ADMIN', 'EDITOR'), createExit)

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener historial de movimientos
 *     description: |
 *       Requiere autenticación JWT.
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
 *                $ref: '#/components/schemas/PaginatedMovements'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getMovements)

export default router
