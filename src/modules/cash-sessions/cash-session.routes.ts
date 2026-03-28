import { Role } from '@prisma/client'
import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import {
	closeCashSession,
	createCashSession,
	getActiveCashSessionByRegisterId,
	getCashSessionById,
	getCashSessions,
	getMyActiveCashSession,
} from './cash-session.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: CashSessions
 *     description: Apertura, consulta y cierre de sesiones de caja
 */

router.use(authMiddleware)

/**
 * @swagger
 * /api/cash-sessions/me/active:
 *   get:
 *     summary: Obtener la sesión activa del usuario autenticado
 *     description: |
 *       Retorna la sesión de caja abierta del usuario autenticado.
 *       Si el usuario no tiene una sesión abierta, retorna `null`.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión activa del usuario o null si no existe
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CashSession'
 *               nullable: true
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get(
	'/me/active',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	getMyActiveCashSession,
)

/**
 * @swagger
 * /api/cash-sessions/registers/{registerId}/active:
 *   get:
 *     summary: Obtener la sesión activa de una caja registradora
 *     description: |
 *       Retorna la sesión abierta asociada a una caja registradora.
 *       Si la caja existe pero no tiene sesión abierta, retorna `null`.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registerId
 *         required: true
 *         description: ID de la caja registradora
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sesión activa de la caja o null si no existe
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CashSession'
 *               nullable: true
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Caja registradora no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: CASH_REGISTER_NOT_FOUND
 *               message: Caja registradora no encontrada
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get(
	'/registers/:registerId/active',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	getActiveCashSessionByRegisterId,
)

/**
 * @swagger
 * /api/cash-sessions/open:
 *   post:
 *     summary: Abrir una sesión de caja
 *     description: |
 *       Abre una nueva sesión de caja para el usuario autenticado.
 *
 *       Validaciones importantes:
 *         - El usuario no puede tener otra sesión abierta.
 *         - La caja debe existir y estar activa.
 *         - La caja no puede tener otra sesión abierta.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registerId
 *               - openingAmount
 *             properties:
 *               registerId:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la caja registradora
 *               openingAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Monto inicial en caja
 *           example:
 *             registerId: 5d2b4903-af5a-4784-9436-fe734750730e
 *             openingAmount: 1000
 *     responses:
 *       201:
 *         description: Sesión de caja creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashSession'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Caja registradora o usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               cashRegisterNotFound:
 *                 value:
 *                   code: CASH_REGISTER_NOT_FOUND
 *                   message: Caja registradora no encontrada
 *               userNotFound:
 *                 value:
 *                   code: USER_NOT_FOUND
 *                   message: Usuario no encontrado
 *       409:
 *         $ref: '#/components/responses/CashSessionConflictError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post('/open', authorizeRoles(Role.ADMIN, Role.EDITOR), createCashSession)

/**
 * @swagger
 * /api/cash-sessions:
 *   get:
 *     summary: Obtener sesiones de caja
 *     description: |
 *       Retorna una lista paginada de sesiones de caja con filtros por
 *       caja registradora, usuario, estatus y rangos de fechas de apertura o cierre.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
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
 *         name: registerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/CashSessionStatus'
 *       - in: query
 *         name: openedFrom
 *         description: Fecha inicial de apertura en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: openedTo
 *         description: Fecha final de apertura en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: closedFrom
 *         description: Fecha inicial de cierre en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: closedTo
 *         description: Fecha final de cierre en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista paginada de sesiones de caja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCashSessions'
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
router.get('/', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashSessions)

/**
 * @swagger
 * /api/cash-sessions/{id}:
 *   get:
 *     summary: Obtener una sesión de caja por ID
 *     description: |
 *       Retorna el detalle de una sesión de caja específica.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sesión de caja
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sesión de caja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashSession'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/CashSessionNotFoundError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.get('/:id', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashSessionById)

/**
 * @swagger
 * /api/cash-sessions/{id}/close:
 *   post:
 *     summary: Cerrar una sesión de caja
 *     description: |
 *       Cierra una sesión de caja abierta, calcula el monto esperado con base
 *       en las ventas pagadas de la sesión y registra la diferencia contra el conteo real.
 *
 *       Roles permitidos:
 *         - ADMIN
 *         - EDITOR
 *     tags: [CashSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sesión de caja
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
 *               - countedAmount
 *             properties:
 *               countedAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Monto contado físicamente al cerrar caja
 *           example:
 *             countedAmount: 2440
 *     responses:
 *       200:
 *         description: Sesión de caja cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashSession'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               cashSessionNotFound:
 *                 value:
 *                   code: CASH_SESSION_NOT_FOUND
 *                   message: Sesión de caja no encontrada
 *               userNotFound:
 *                 value:
 *                   code: USER_NOT_FOUND
 *                   message: Usuario no encontrado
 *       409:
 *         $ref: '#/components/responses/CashSessionConflictError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequestsError'
 *       500:
 *         $ref: '#/components/responses/UnexpectedError'
 */
router.post(
	'/:id/close',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	closeCashSession,
)

export default router
