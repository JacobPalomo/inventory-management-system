import { Prisma } from '@prisma/client'
import { createAuditLogRepo } from './audit-log.repository'
import { TAuditLog, TCreateAuditLog } from './audit-log.types'

export const createAuditLog = async (
	tx: Prisma.TransactionClient,
	data: TCreateAuditLog,
): Promise<TAuditLog> => {
	return await createAuditLogRepo(tx, data)
}
