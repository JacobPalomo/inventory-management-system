import {
	AuditAction,
	CashSessionStatus,
	EntityType,
	Prisma,
	SaleStatus,
} from '@prisma/client'
import { prisma } from '../../config/prisma'
import { createAuditLog } from '../audit-logs/audit-log.helpers'
import { getDiff } from '../audit-logs/audit-log.utils'
import {
	TCloseCashSession,
	TCreateCashSession,
} from './cash-session.schema'
import { cashSessionSelect, TCashSession } from './cash-session.types'

const serializeCashSessionForAudit = (cashSession: TCashSession) => {
	const { register, user, closedBy, ...safeCashSession } = cashSession

	return {
		...safeCashSession,
		openedAt: cashSession.openedAt.toISOString(),
		closedAt: cashSession.closedAt?.toISOString() ?? null,
	}
}

const buildPaidSalesWhere = (sessionId: string): Prisma.SaleWhereInput => ({
	sessionId,
	status: SaleStatus.PAID,
	isVoided: false,
	cancelledAt: null,
})

export const findCashSessionByIdRepo = async (
	id: string,
): Promise<TCashSession | null> => {
	return prisma.cashSession.findUnique({
		where: { id },
		select: cashSessionSelect,
	})
}

export const findActiveCashSessionByCashRegisterIdRepo = async (
	registerId: string,
): Promise<TCashSession | null> => {
	return prisma.cashSession.findFirst({
		where: {
			registerId,
			status: CashSessionStatus.OPEN,
		},
		orderBy: { openedAt: 'desc' },
		select: cashSessionSelect,
	})
}

export const findActiveCashSessionByUserIdRepo = async (
	userId: string,
): Promise<TCashSession | null> => {
	return prisma.cashSession.findFirst({
		where: {
			userId,
			status: CashSessionStatus.OPEN,
		},
		orderBy: { openedAt: 'desc' },
		select: cashSessionSelect,
	})
}

export const findCashSessionsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.CashSessionWhereInput
}): Promise<{ data: TCashSession[]; total: number }> => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.cashSession.findMany({
			where,
			skip,
			take,
			orderBy: { openedAt: 'desc' },
			select: cashSessionSelect,
		}),
		prisma.cashSession.count({ where }),
	])

	return { data, total }
}

export const createCashSessionRepo = async (
	userId: string,
	data: TCreateCashSession,
): Promise<TCashSession> => {
	return prisma.$transaction(async tx => {
		const cashSession = await tx.cashSession.create({
			data: {
				...data,
				userId,
			},
			select: cashSessionSelect,
		})

		await createAuditLog(tx, {
			userId,
			action: AuditAction.CREATE,
			entity: EntityType.CashSession,
			entityId: cashSession.id,
			newValue: serializeCashSessionForAudit(cashSession),
		})

		return cashSession
	})
}

export const closeCashSessionRepo = async (params: {
	closedById: string
	cashSession: TCashSession
	data: TCloseCashSession
}): Promise<TCashSession> => {
	const { closedById, cashSession, data } = params

	return prisma.$transaction(async tx => {
		const paidSalesTotals = await tx.sale.aggregate({
			where: buildPaidSalesWhere(cashSession.id),
			_sum: {
				total: true,
			},
		})

		const expectedAmount =
			cashSession.openingAmount + (paidSalesTotals._sum.total ?? 0)

		const closedCashSession = await tx.cashSession.update({
			where: { id: cashSession.id },
			data: {
				expectedAmount,
				countedAmount: data.countedAmount,
				difference: data.countedAmount - expectedAmount,
				status: CashSessionStatus.CLOSED,
				closedAt: new Date(),
				closedById,
			},
			select: cashSessionSelect,
		})

		const { oldValue, newValue } = getDiff(
			serializeCashSessionForAudit(cashSession),
			serializeCashSessionForAudit(closedCashSession),
		)

		await createAuditLog(tx, {
			userId: closedById,
			action: AuditAction.UPDATE,
			entity: EntityType.CashSession,
			entityId: cashSession.id,
			oldValue,
			newValue,
		})

		return closedCashSession
	})
}
