/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestión de pagos aplicados a ventas
 */

import { Role } from '@prisma/client'
import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import {
	createPayment,
	getPaymentById,
	getPayments,
} from './payment.controller'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Registrar pago a una venta
 *     description: |
 *       Registra un pago parcial o total sobre una venta.
 *       Si el total pagado alcanza el total de la venta, la venta cambia a estado `PAID`.
 *
 *       Validaciones importantes:
 *         - La venta debe existir y poder recibir pagos.
 *         - El monto no puede exceder el saldo pendiente.
 *         - Si la venta pertenece a una sesión de caja, la sesión debe estar abierta.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Payments]
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
 *               - amount
 *             properties:
 *               saleId:
 *                 type: string
 *                 format: uuid
 *               method:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               reference:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *           example:
 *             saleId: 66cba4df-57f0-4b7b-a16b-3be12b72c4e3
 *             method: CASH
 *             amount: 1200
 *             reference: Ticket 12345
 *     responses:
 *       201:
 *         description: Pago registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *                 sale:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Venta o pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto al aplicar el pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/', authorizeRoles(Role.ADMIN, Role.EDITOR), createPayment)

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Obtener pagos
 *     description: |
 *       Retorna una lista paginada de pagos con filtros por venta, sesión,
 *       usuario, método de pago y rango de fechas.
 *     tags: [Payments]
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
 *         description: Lista paginada de pagos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPayments'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getPayments)

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obtener pago por ID
 *     tags: [Payments]
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
 *         description: Pago encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getPaymentById)

export default router
