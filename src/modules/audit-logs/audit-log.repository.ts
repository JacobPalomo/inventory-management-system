import { auditLogSelect, TAuditLog, TCreateAuditLog } from './audit-log.types'
import { prisma } from '../../config/prisma'
import { Prisma } from '@prisma/client'

export const createAuditLogRepo = async (
	tx: Prisma.TransactionClient,
	data: TCreateAuditLog,
): Promise<TAuditLog> => {
	return await tx.auditLog.create({
		select: auditLogSelect,
		data: {
			...data,
			oldValue: data.oldValue,
			newValue: data.newValue,
		},
	})
}

export const getAuditLogsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.AuditLogWhereInput
}): Promise<{ data: TAuditLog[]; total: number }> => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.auditLog.findMany({
			select: auditLogSelect,
			where,
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.auditLog.count(),
	])

	return { data: data as unknown as TAuditLog[], total }
}
