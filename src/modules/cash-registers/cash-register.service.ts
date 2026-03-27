import { Prisma } from '@prisma/client'
import { PaginationResponse } from '../../shared/types/pagination'
import { TCashRegister } from './cash-register.types'
import {
	createCashRegisterRepo,
	findCashRegisterByIdRepo,
	findCashRegisterByNameRepo,
	findCashRegistersRepo,
	updateCashRegisterRepo,
} from './cash-register.repository'
import { AppError } from '../../shared/utils/AppError'
import {
	TCashRegistersQuery,
	TCreateCashRegister,
	TUpdateCashRegister,
} from './cash-register.schema'

export const getCashRegisterByIdService = async (
	cashRegisterId: string,
): Promise<TCashRegister> => {
	const cashRegister = await findCashRegisterByIdRepo(cashRegisterId)

	if (!cashRegister) throw new AppError('CASH_REGISTER_NOT_FOUND')

	return cashRegister
}

export const getCashRegistersService = async (
	query: TCashRegistersQuery,
): Promise<PaginationResponse<TCashRegister>> => {
	const { page, limit, name, isActive } = query

	const skip = (page - 1) * limit

	const where: Prisma.CashRegisterWhereInput = {
		AND: [
			name
				? {
						name: {
							contains: name,
							mode: 'insensitive',
						},
					}
				: {},
			isActive
				? {
						isActive,
					}
				: {},
		],
	}

	const { data, total } = await findCashRegistersRepo({
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

export const createCashRegisterService = async (
	userId: string,
	data: TCreateCashRegister,
): Promise<TCashRegister> => {
	const existingCashRegister = await findCashRegisterByNameRepo(data.name)
	if (existingCashRegister) throw new AppError('CASH_REGISTER_ALREADY_EXISTS')

	return await createCashRegisterRepo(userId, data)
}

export const updateCashRegisterService = async (
	userId: string,
	cashRegisterId: string,
	data: TUpdateCashRegister,
): Promise<TCashRegister> => {
	if (data.name) {
		const existingCashRegisterWithSameName = await findCashRegisterByNameRepo(
			data.name,
		)
		if (existingCashRegisterWithSameName)
			throw new AppError('CASH_REGISTER_ALREADY_EXISTS')
	}

	const cashRegister = await findCashRegisterByIdRepo(cashRegisterId)
	if (!cashRegister) throw new AppError('CASH_REGISTER_NOT_FOUND')

	return await updateCashRegisterRepo(cashRegister, userId, data)
}
