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

router.use(authMiddleware)

router.post('/', authorizeRoles(Role.ADMIN), createCashRegister)

router.get('/', authorizeRoles(Role.ADMIN, Role.EDITOR), getCashRegisters)

router.get('/:id', getCashRegisterById)

router.put('/:id', authorizeRoles(Role.ADMIN), updateCashRegister)

export default router
