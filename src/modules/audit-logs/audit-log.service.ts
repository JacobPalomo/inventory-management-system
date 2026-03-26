import { Prisma } from '@prisma/client'
import { getAuditLogsRepo } from './audit-log.repository'
import { TAuditLog, TAuditLogQuery } from './audit-log.types'
import { PaginatedResponse } from '../../types/pagination'
import { formatToDate } from '../../utils/formatDate'

export const getAuditLogsService = async (
	query: TAuditLogQuery,
): Promise<PaginatedResponse<TAuditLog>> => {
	const { page, limit, entityId, entity, userId, dateFrom, dateTo, action } =
		query

	const skip = (page - 1) * limit

	const where: Prisma.AuditLogWhereInput = {
		AND: [
			entityId ? { entityId } : {},
			entity ? { entity } : {},
			userId ? { userId } : {},
			dateFrom && dateTo
				? {
						createdAt: {
							gte: formatToDate(dateFrom),
							lte: formatToDate(dateTo),
						},
					}
				: {},
			action ? { action } : {},
		],
	}

	const { data, total } = await getAuditLogsRepo({
		skip,
		take: limit,
		where,
	})

	return {
		data,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(data.length / limit),
		},
	}
}
