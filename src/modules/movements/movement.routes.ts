import { Router } from 'express'
import { createEntry, createExit, getMovements } from './movement.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/in', authorizeRoles('ADMIN', 'EDITOR'), createEntry)
router.post('/out', authorizeRoles('ADMIN', 'EDITOR'), createExit)
router.get('/', getMovements)

export default router
