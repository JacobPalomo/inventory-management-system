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
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', authorizeRoles('ADMIN', 'EDITOR'), createProduct)

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos con paginación y filtros
 *     tags: [Products]
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
 *         name: search
 *         schema:
 *           type: string
 *         example: laptop
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         example: true
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: uuid
 *                   name: Laptop
 *                   stock: 5
 *               meta:
 *                 total: 50
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
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
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getProductById)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Laptop actualizada
 *             stock: 15
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', authorizeRoles('ADMIN', 'EDITOR'), updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete('/:id', authorizeRoles('ADMIN'), deleteProduct)

export default router
