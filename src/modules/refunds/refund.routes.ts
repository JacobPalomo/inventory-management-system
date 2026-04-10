/**
 * @swagger
 * tags:
 *   name: Refunds
 *   description: Gestión de devoluciones aplicadas a ventas
 */

import { Role } from '@prisma/client'
import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import {
	createRefund,
	getRefundById,
	getRefunds,
} from './refund.controller'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/refunds:
 *   post:
 *     summary: Registrar devolución de una venta
 *     description: |
 *       Registra una devolución parcial o total sobre una venta pagada.
 *       El monto total de la devolución se calcula automáticamente a partir de los items devueltos.
 *       Cuando el total devuelto alcanza el total de la venta, la venta cambia a estado `REFUNDED`.
 *
 *       Validaciones importantes:
 *         - La venta debe existir y poder recibir devoluciones.
 *         - Cada item debe pertenecer a la venta y no exceder la cantidad aún disponible por devolver.
 *         - El monto no puede exceder el saldo reembolsable acumulado.
 *         - El monto no puede exceder el saldo disponible del método seleccionado.
 *         - Si `method=CASH`, el usuario debe tener una sesión de caja abierta y la devolución queda ligada a esa sesión.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - saleId
 *               - method
 *               - items
 *             properties:
 *               saleId:
 *                 type: string
 *                 format: uuid
 *               method:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *               reference:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - saleItemId
 *                     - quantity
 *                   properties:
 *                     saleItemId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *           example:
 *             saleId: 66cba4df-57f0-4b7b-a16b-3be12b72c4e3
 *             method: CASH
 *             reference: Ticket devolución 123
 *             reason: Producto devuelto por el cliente
 *             items:
 *               - saleItemId: 1787d74f-734b-46c2-82dd-5fb8eb8d6ae9
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Devolución registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refund:
 *                   $ref: '#/components/schemas/Refund'
 *                 sale:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Venta o devolución no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: La venta o alguno de sus items no puede recibir devoluciones, el monto excede el saldo disponible o falta sesión para una devolución en efectivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/', authorizeRoles(Role.ADMIN, Role.EDITOR), createRefund)

/**
 * @swagger
 * /api/refunds:
 *   get:
 *     summary: Obtener devoluciones
 *     description: |
 *       Retorna una lista paginada de devoluciones con filtros por venta,
 *       sesión, usuario y rango de fechas.
 *     tags: [Refunds]
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
 *         name: saleId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sessionId
 *         description: ID de la sesión de caja que procesó la devolución
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: method
 *         schema:
 *           $ref: '#/components/schemas/PaymentMethod'
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount, method]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Lista paginada de devoluciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRefunds'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getRefunds)

/**
 * @swagger
 * /api/refunds/{id}:
 *   get:
 *     summary: Obtener devolución por ID
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Devolución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refund'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Devolución no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getRefundById)

export default router
