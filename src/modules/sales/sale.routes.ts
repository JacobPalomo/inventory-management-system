/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Gestión de ventas
 */

import { Router } from 'express'
import { Role } from '@prisma/client'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import {
	addItemToSale,
	createSale,
	getSaleById,
	getSales,
} from './sale.controller'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Crear venta
 *     description: |
 *       Crea una venta en estado `OPEN` con totales iniciales en cero.
 *
 *       La venta puede crearse vacía y después recibir items.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *           example:
 *             sessionId: 50fa8bea-75de-45a2-b70b-5f68b8375fd7
 *             customerId: 7f1fb0e1-c406-4021-a0dd-4379069fb32a
 *             notes: Venta mostrador
 *     responses:
 *       201:
 *         description: Venta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
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
router.post('/', authorizeRoles(Role.ADMIN, Role.EDITOR), createSale)

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Obtener ventas
 *     description: |
 *       Retorna una lista paginada de ventas con filtros por estado, usuario,
 *       sesión, cliente, totales, fechas y presencia de items.
 *
 *       Usa `withItems=true` para incluir el detalle de items en cada venta.
 *     tags: [Sales]
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
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/SaleStatus'
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: isVoided
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isCancelled
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sessionOpen
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: today
 *         schema:
 *           type: boolean
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
 *       - in: query
 *         name: minTotal
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxTotal
 *         schema:
 *           type: number
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: itemStatus
 *         schema:
 *           $ref: '#/components/schemas/SaleItemStatus'
 *       - in: query
 *         name: itemVoided
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: withItems
 *         schema:
 *           type: boolean
 *           default: false
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, total, subtotal, tax, discount, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Lista paginada de ventas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedSales'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getSales)

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Obtener venta por ID
 *     description: |
 *       Retorna el detalle completo de una venta, incluyendo sus items.
 *     tags: [Sales]
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
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/SaleNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getSaleById)

/**
 * @swagger
 * /api/sales/{id}/items:
 *   post:
 *     summary: Agregar item a una venta
 *     description: |
 *       Agrega un producto a una venta editable, recalcula los totales y,
 *       si el producto maneja inventario, registra una salida de stock.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 nullable: true
 *               discount:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *           example:
 *             productId: 70278e02-6120-4785-a0bc-fb9b52c2aee9
 *             quantity: 2
 *             price: 15000
 *             discount: 500
 *     responses:
 *       201:
 *         description: Item agregado y venta recalculada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Error de validación o descuento inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   code: VALIDATION_ERROR
 *                   message: Error de validación
 *                   details:
 *                     - field: quantity
 *                       message: No puede ser menor que 1
 *               invalidDiscount:
 *                 value:
 *                   code: SALE_INVALID_ITEM_DISCOUNT
 *                   message: El descuento del item no puede ser mayor que el subtotal
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Venta o producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               saleNotFound:
 *                 value:
 *                   code: SALE_NOT_FOUND
 *                   message: Venta no encontrada
 *               productNotFound:
 *                 value:
 *                   code: PRODUCT_NOT_FOUND
 *                   message: Producto no encontrado
 *       409:
 *         description: La venta no puede modificarse o no hay stock suficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               saleNotEditable:
 *                 value:
 *                   code: SALE_NOT_EDITABLE
 *                   message: La venta ya no puede modificarse
 *               insufficientStock:
 *                 value:
 *                   code: PRODUCT_INSUFFICIENT_STOCK
 *                   message: Stock insuficiente
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/:id/items', authorizeRoles(Role.ADMIN, Role.EDITOR), addItemToSale)

export default router
