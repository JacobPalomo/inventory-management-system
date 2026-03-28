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

router.use(authMiddleware)
router.get(
	'/me/active',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	getMyActiveCashSession,
)
router.get(
	'/registers/:registerId/active',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	getActiveCashSessionByRegisterId,
)
router.post('/open', authorizeRoles(Role.ADMIN, Role.EDITOR), createCashSession)
router.get('/', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashSessions)
router.get('/:id', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashSessionById)
router.post(
	'/:id/close',
	authorizeRoles(Role.ADMIN, Role.EDITOR),
	closeCashSession,
)

export default router
