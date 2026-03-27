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
} from './product.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear nuevo producto
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - stock
 *               - minStock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop HP
 *               description:
 *                 type: string
 *                 example: 16GB RAM
 *               stock:
 *                 type: number
 *                 example: 10
 *               minStock:
 *                 type: number
 *                 example: 3
 *           example:
 *             name: Laptop HP
 *             description: 16GB RAM
 *             stock: 10
 *             minStock: 3
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 */
router.post('/', authorizeRoles('ADMIN', 'EDITOR'), createProduct)

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos con paginación y filtros
 *
 *     description: |
 *       Retorna una lista de productos con paginación y filtros.
 *
 *       - Requiere autenticación JWT.
 *       - No es necesario un rol en específico.
 *
 *     tags: [Products]
 *
 *     security:
 *       - bearerAuth: []
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
 *         description: Permite filtrar por nombre de producto
 *         schema:
 *           type: string
 *         example: laptop
 *
 *       - in: query
 *         name: lowStock
 *         description: Permite filtrar por productos con stock por debajo del mínimo
 *         schema:
 *           type: boolean
 *         example: true
 *
 *       - in: query
 *         name: isActive
 *         description: Permite filtrar por estado del producto (activo o inactivo)
 *         schema:
 *           type: boolean
 *         example: true
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
 *       Requiere autenticación JWT.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getProductById)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [ADMIN, EDITOR]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 example: Laptop HP
 *               description:
 *                 type: string
 *                 example: 16GB RAM
 *               minStock:
 *                 type: number
 *                 example: 3
 *               isActive:
 *                 type: boolean
 *                 example: false
 *           example:
 *             name: Laptop actualizada
 *             minStock: 5
 *             isActive: true
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.put('/:id', authorizeRoles('ADMIN', 'EDITOR'), updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     description: |
 *       Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [ADMIN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'El producto fue eliminado correctamente'
 *
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.delete('/:id', authorizeRoles('ADMIN'), deleteProduct)

export default router
