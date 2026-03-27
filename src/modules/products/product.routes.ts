/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

import { Router } from 'express'
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
	getProductByBarcode,
	adjustProductStock,
	restoreProduct,
} from './product.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto
 *     description: |
 *       Crea un nuevo producto en el sistema.
 *
 *       - Requiere autenticación JWT.
 *       - Permite definir configuración inicial de inventario.
 *       - El costo solo se establece al crear.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop HP
 *               description:
 *                 type: string
 *                 example: Laptop HP 16GB RAM
 *               price:
 *                 type: number
 *                 example: 15000
 *               cost:
 *                 type: number
 *                 example: 12000
 *               stock:
 *                 type: number
 *                 example: 10
 *               minStock:
 *                 type: number
 *                 example: 3
 *               maxStock:
 *                 type: number
 *                 example: 50
 *               taxRate:
 *                 type: number
 *                 example: 0.16
 *               trackStock:
 *                 type: boolean
 *                 example: true
 *               allowNegative:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *       409:
 *         $ref: '#/components/responses/CreateProductConflictError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/', authorizeRoles('ADMIN', 'EDITOR'), createProduct)

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos
 *     description: |
 *       Retorna una lista paginada de productos con filtros avanzados.
 *
 *       Filtros disponibles:
 *       - search → nombre, SKU o código de barras
 *       - isActive → activos o inactivos
 *       - lowStock → stock <= minStock
 *       - outOfStock → stock = 0
 *       - negativeStock → stock < 0
 *       - trackStock → productos que manejan inventario
 *       - minPrice / maxPrice → rango de precios
 *       - sortBy / sortOrder → ordenamiento
 *
 *       Requiere autenticación JWT.
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página (mínimo 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         description: Cantidad de registros por página (1 - 100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *       - in: query
 *         name: search
 *         description: Buscar por nombre, SKU o código de barras
 *         schema:
 *           type: string
 *         example: laptop
 *
 *       - in: query
 *         name: isActive
 *         description: Filtrar productos activos/inactivos
 *         schema:
 *           type: boolean
 *         example: true
 *
 *       - in: query
 *         name: lowStock
 *         description: Productos con stock menor o igual al mínimo
 *         schema:
 *           type: boolean
 *         example: true
 *
 *       - in: query
 *         name: outOfStock
 *         description: Productos sin stock
 *         schema:
 *           type: boolean
 *         example: false
 *
 *       - in: query
 *         name: negativeStock
 *         description: Productos con stock negativo
 *         schema:
 *           type: boolean
 *         example: false
 *
 *       - in: query
 *         name: trackStock
 *         description: Filtrar productos que manejan inventario
 *         schema:
 *           type: boolean
 *         example: true
 *
 *       - in: query
 *         name: minPrice
 *         description: Precio mínimo
 *         schema:
 *           type: number
 *         example: 100
 *
 *       - in: query
 *         name: maxPrice
 *         description: Precio máximo
 *         schema:
 *           type: number
 *         example: 1000
 *
 *       - in: query
 *         name: sortBy
 *         description: Campo de ordenamiento
 *         schema:
 *           type: string
 *           enum: [name, price, stock, createdAt, updatedAt]
 *
 *       - in: query
 *         name: sortOrder
 *         description: Dirección de ordenamiento
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: |
 *       Retorna la información detallada de un producto.
 *
 *       Requiere autenticación JWT.
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getProductById)

/**
 * @swagger
 * /api/products/barcode/{barcode}:
 *   get:
 *     summary: Obtener producto por código de barras
 *     description: |
 *       Retorna un producto utilizando su código de barras.
 *
 *       Este endpoint está diseñado principalmente para
 *       lectores de código de barras en POS o inventario.
 *
 *       Requiere autenticación JWT.
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         example: 7501234567890
 *
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/barcode/:barcode', getProductByBarcode)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Actualizar producto
 *     description: |
 *       Actualiza información general del producto.
 *
 *       Campos editables:
 *       - name
 *       - description
 *       - price
 *       - barcode
 *       - sku
 *       - taxRate
 *       - trackStock
 *       - allowNegative
 *       - isActive
 *
 *       No permite modificar:
 *       - stock
 *       - reservedStock
 *       - cost
 *       - avgCost
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop HP Actualizada
 *               description:
 *                 type: string
 *                 example: Laptop HP 32GB RAM
 *               price:
 *                 type: number
 *                 example: 16000
 *               barcode:
 *                 type: string
 *                 example: 7501234567890
 *               sku:
 *                 type: string
 *                 example: LAP-HP-002
 *               taxRate:
 *                 type: number
 *                 example: 0.16
 *               trackStock:
 *                 type: boolean
 *                 example: true
 *               allowNegative:
 *                 type: boolean
 *                 example: false
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       409:
 *         $ref: '#/components/responses/UpdateProductConflictError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.patch('/:id', authorizeRoles('ADMIN', 'EDITOR'), updateProduct)

/**
 * @swagger
 * /api/products/{id}/adjust-stock:
 *   post:
 *     summary: Ajustar stock manualmente
 *     description: |
 *       Permite ajustar manualmente el stock de un producto.
 *
 *       Este endpoint:
 *       - Actualiza el stock del producto
 *       - Registra un movimiento de inventario
 *       - Guarda el motivo del ajuste
 *       - Guarda el costo actual del producto
 *
 *       quantity:
 *       - positivo → entrada
 *       - negativo → salida
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - reason
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 5
 *                 description: Cantidad a ajustar (negativo para salida)
 *               reason:
 *                 type: string
 *                 example: Ajuste por inventario físico
 *
 *           examples:
 *             addStock:
 *               summary: Agregar stock
 *               value:
 *                 quantity: 10
 *                 reason: Inventario inicial
 *
 *             removeStock:
 *               summary: Reducir stock
 *               value:
 *                 quantity: -3
 *                 reason: Producto dañado
 *
 *     responses:
 *       200:
 *         description: Stock ajustado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 *       400:
 *         description: Error de validación o parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 summary: Error de validación
 *                 value:
 *                   code: VALIDATION_ERROR
 *                   message: Error de validación
 *                   details:
 *                     - field: reason
 *                       message: String must contain at least 1 character(s)
 *               invalidQueryParams:
 *                 summary: Producto sin control de inventario
 *                 value:
 *                   code: INVALID_QUERY_PARAMS
 *                   message: Parámetros de consulta inválidos
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       409:
 *         $ref: '#/components/responses/ProductInsufficientStockError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post(
	'/:id/adjust-stock',
	authorizeRoles('ADMIN', 'EDITOR'),
	adjustProductStock,
)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminación lógica de producto
 *     description: |
 *       Realiza una eliminación lógica del producto.
 *
 *       El producto no se elimina físicamente,
 *       solo se marca como inactivo.
 *
 *       Roles permitidos:
 *         - ADMIN
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: El producto fue eliminado correctamente
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
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       409:
 *         $ref: '#/components/responses/ProductAlreadyDeletedError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.delete('/:id', authorizeRoles('ADMIN'), deleteProduct)

/**
 * @swagger
 * /api/products/{id}/restore:
 *   patch:
 *     summary: Restaurar producto eliminado
 *     description: |
 *       Restaura un producto previamente eliminado de forma lógica.
 *
 *       El producto volverá a estar activo en el sistema.
 *
 *       Roles permitidos:
 *         - ADMIN
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Producto restaurado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *
 *       409:
 *         $ref: '#/components/responses/ProductAlreadyExistsError'
 *
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.patch('/:id/restore', authorizeRoles('ADMIN'), restoreProduct)

export default router
