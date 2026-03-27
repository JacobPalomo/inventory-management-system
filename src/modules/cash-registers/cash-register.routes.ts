import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
	createCashRegister,
	getCashRegisters,
	getCashRegisterById,
	updateCashRegister,
} from './cash-register.controller'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { Role } from '@prisma/client'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: CashRegisters
 *     description: Cajas registradoras
 */

router.use(authMiddleware)

/**
 * @swagger
 * /api/cash-registers:
 *   post:
 *     summary: Registrar una nueva caja registradora
 *
 *     description: |
 *       Permite crear una nueva caja registradora.
 *
 *         - Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *
 *     tags: [CashRegisters]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la nueva caja
 *                 example: Caja 1
 *               description:
 *                 type: string
 *                 description: Descripción de la nueva caja
 *                 example: Caja principal
 *           example:
 *             name: Caja 1
 *             description: Caja principal
 *
 *     responses:
 *       201:
 *         description: Caja creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashRegister'
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
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/', authorizeRoles(Role.ADMIN), createCashRegister)

/**
 * @swagger
 * /api/cash-registers:
 *   get:
 *     summary: Obtener cajas registradoras
 *
 *     description: |
 *       Retorna una lista de cajas registradoras con paginación y filtros.
 *
 *       - Requiere autenticación.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *
 *     tags: [CashRegisters]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
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
 *         name: name
 *         description: Permite buscar por nombre de caja
 *         schema:
 *           type: string
 *         example: Caja 1
 *
 *       - in: query
 *         name: isActive
 *         description: Permite filtrar por estatus de caja (activo o inactivo)
 *         schema:
 *           type: boolean
 *         example: true
 *
 *     responses:
 *       200:
 *         description: Lista paginada de cajas registradoras
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PaginatedCashRegisters'
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
router.get('/', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashRegisters)

/**
 * @swagger
 * /api/cash-registers/{id}:
 *   get:
 *     summary: Obtener detalle caja registradora
 *     description: |
 *       Retorna el detalle de una caja registradora por su ID
 *
 *       - Requiere autenticación JWT.
 *       - No se requiere un rol en específico.
 *
 *     tags: [CashRegisters]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la caja registradora
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Detalle de la caja registradora
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashRegister'
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
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', getCashRegisterById)

/**
 * @swagger
 * /api/cash-registers/{id}:
 *   put:
 *     summary: Actualizar caja registradora
 *     description: |
 *       Permite actualizar el nombre y la descripción de una caja registradora.
 *
 *       - Requiere autenticación JWT.
 *
 *       Roles permitidos:
 *         - ADMIN
 *
 *     tags: [CashRegisters]
 *
 *     security:
 *       - bearerAuth: [ADMIN]
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
 *                 description: Nombre de la nueva caja
 *                 example: Caja 1
 *               description:
 *                 type: string
 *                 description: Descripción de la nueva caja
 *                 example: Registro de la caja principal (Caja 1)
 *           example:
 *             name: Caja 1
 *             description: Caja principal
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la caja registradora
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Caja registradora actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashRegister'
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
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.put('/:id', authorizeRoles(Role.ADMIN), updateCashRegister)

export default router
