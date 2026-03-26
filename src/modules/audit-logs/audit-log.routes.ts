import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'
import { Role } from '@prisma/client'
import { getAuditLogs, getAuditLogsByEntity } from './audit-log.controller'

const router = Router()

router.use(authMiddleware)

router.get('/audit', authorizeRoles(Role.ADMIN), getAuditLogs)

router.get('/audit/:entity/:id', getAuditLogsByEntity)

export default router
