import { createAuditLogRepo } from './audit-log.repository'
import { TAuditLog, TCreateAuditLog } from './audit-log.types'

export const createAuditLog = async (
	data: TCreateAuditLog,
): Promise<TAuditLog> => {
	return await createAuditLogRepo(data)
}
