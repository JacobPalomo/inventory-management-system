import { CashSessionStatus, Prisma } from '@prisma/client'
import { findCashRegisterByIdRepo } from '../cash-registers/cash-register.repository'
import { findUserByIdRepo } from '../users/user.repository'
import { PaginationResponse } from '../../shared/types/pagination'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { AppError } from '../../shared/utils/AppError'
import {
	closeCashSessionRepo,
	createCashSessionRepo,
	findActiveCashSessionByCashRegisterIdRepo,
	findActiveCashSessionByUserIdRepo,
	findCashSessionByIdRepo,
	findCashSessionsRepo,
} from './cash-session.repository'
import {
	TCashSessionQuery,
	TCloseCashSession,
	TCreateCashSession,
} from './cash-session.schema'
import { TCashSession } from './cash-session.types'

export const getCashSessionByIdService = async (
	cashSessionId: string,
): Promise<TCashSession> => {
	const cashSession = await findCashSessionByIdRepo(cashSessionId)

	if (!cashSession) {
		throw new AppError('CASH_SESSION_NOT_FOUND')
	}

	return cashSession
}

export const getCashSessionsService = async (
	query: TCashSessionQuery,
): Promise<PaginationResponse<TCashSession>> => {
	const {
		page,
		limit,
		registerId,
		userId,
		status,
		openedFrom,
		openedTo,
		closedFrom,
		closedTo,
	} = query

	const skip = (page - 1) * limit

	const where: Prisma.CashSessionWhereInput = {
		AND: [
			registerId ? { registerId } : {},
			userId ? { userId } : {},
			status ? { status } : {},
			openedFrom || openedTo
				? {
						openedAt: {
							...(openedFrom ? { gte: formatFromDate(openedFrom) } : {}),
							...(openedTo ? { lte: formatToDate(openedTo) } : {}),
						},
					}
				: {},
			closedFrom || closedTo
				? {
						closedAt: {
							...(closedFrom ? { gte: formatFromDate(closedFrom) } : {}),
							...(closedTo ? { lte: formatToDate(closedTo) } : {}),
						},
					}
				: {},
		],
	}

	const { data, total } = await findCashSessionsRepo({
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
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const getMyActiveCashSessionService = async (
	userId: string,
): Promise<TCashSession | null> => {
	return findActiveCashSessionByUserIdRepo(userId)
}

export const getActiveCashSessionByRegisterIdService = async (
	registerId: string,
): Promise<TCashSession | null> => {
	const cashRegister = await findCashRegisterByIdRepo(registerId)

	if (!cashRegister) {
		throw new AppError('CASH_REGISTER_NOT_FOUND')
	}

	return findActiveCashSessionByCashRegisterIdRepo(registerId)
}

export const createCashSessionService = async (
	userId: string,
	data: TCreateCashSession,
): Promise<TCashSession> => {
	const user = await findUserByIdRepo(userId)
	if (!user) throw new AppError('USER_NOT_FOUND')

	const cashRegister = await findCashRegisterByIdRepo(data.registerId)
	if (!cashRegister) throw new AppError('CASH_REGISTER_NOT_FOUND')
	if (!cashRegister.isActive) throw new AppError('CASH_REGISTER_IS_NOT_ACTIVE')

	const [activeUserSession, activeRegisterSession] = await Promise.all([
		findActiveCashSessionByUserIdRepo(userId),
		findActiveCashSessionByCashRegisterIdRepo(data.registerId),
	])

	if (activeUserSession) {
		throw new AppError('ACTIVE_CASH_SESSION_CONFLICT')
	}

	if (activeRegisterSession) {
		throw new AppError('CASH_REGISTER_ALREADY_HAS_ACTIVE_SESSION')
	}

	return createCashSessionRepo(userId, data)
}

export const closeCashSessionService = async (
	cashSessionId: string,
	closedById: string,
	data: TCloseCashSession,
): Promise<TCashSession> => {
	const [cashSession, closedByUser] = await Promise.all([
		findCashSessionByIdRepo(cashSessionId),
		findUserByIdRepo(closedById),
	])

	if (!closedByUser) throw new AppError('USER_NOT_FOUND')
	if (!cashSession) throw new AppError('CASH_SESSION_NOT_FOUND')

	if (cashSession.status !== CashSessionStatus.OPEN) {
		throw new AppError('CASH_SESSION_ALREADY_CLOSED')
	}

	return closeCashSessionRepo({
		closedById,
		cashSession,
		data,
	})
}
