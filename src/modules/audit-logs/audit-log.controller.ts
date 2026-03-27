import { NextFunction, Request, Response } from 'express'
import {
	auditLogsByEntityParamsSchema,
	auditLogsByEntityQuerySchema,
	auditLogsQuerySchema,
} from './audit-log.schema'
import { getAuditLogsService } from './audit-log.service'

export const getAuditLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = auditLogsQuerySchema.parse(req.query)

		const auditLogs = await getAuditLogsService(query)
		res.status(200).json(auditLogs)
	} catch (error) {
		next(error)
	}
}

export const getAuditLogsByEntity = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = auditLogsByEntityParamsSchema.parse(req.params)
		const query = auditLogsByEntityQuerySchema.parse(req.query)

		const entityAuditLogs = await getAuditLogsService({
			...query,
			...params,
		})

		res.status(200).json(entityAuditLogs)
	} catch (error) {
		next(error)
	}
}
