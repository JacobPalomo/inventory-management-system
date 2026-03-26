import { NextFunction, Request, Response } from 'express'
import {
	auditLogQuerySchema,
	auditLogsByEntityParamsSchema,
} from './audit-log.schema'
import { validatePaginateQuerySchema } from '../../schemas/pagination.schema'
import { getAuditLogsService } from './audit-log.service'
import { TAuditLogQuery, TAuditLogsByEntityParams } from './audit-log.types'

export const getAuditLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10

		const parsedQuery = auditLogQuerySchema.parse({
			...req.query,
			page,
			limit,
		}) as TAuditLogQuery

		const auditLogs = await getAuditLogsService(parsedQuery)
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
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10

		const { entity, entityId } = auditLogsByEntityParamsSchema.parse(
			req.params,
		) as TAuditLogsByEntityParams

		const parsePaginateQuery = validatePaginateQuerySchema.parse({
			page,
			limit,
		})

		const entityAuditLogs = await getAuditLogsService({
			page: parsePaginateQuery.page,
			limit: parsePaginateQuery.limit,
			entity,
			entityId,
		})

		res.status(200).json(entityAuditLogs)
	} catch (error) {
		next(error)
	}
}
