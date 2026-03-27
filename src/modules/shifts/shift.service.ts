import { Prisma } from '@prisma/client'
import { ShiftResponse, TCreateShift, TUpdateShift } from './shift.types'
import {
	createShiftRepo,
	deleteShiftRepo,
	findOverlappingShift,
	findShiftById,
	getShiftsRepo,
	updateShiftRepo,
} from './shift.repository'
import { AppError } from '../../shared/utils/AppError'
import { generateShiftResponse } from './shift.utils'
import { TShiftsQuery } from './shift.schema'
import { PaginationResponse } from '../../shared/types/pagination'

export const getShiftsService = async (
	query: TShiftsQuery,
): Promise<PaginationResponse<ShiftResponse>> => {
	const { page, limit, search, isActive } = query

	const skip = (page - 1) * limit

	const where: Prisma.ShiftWhereInput = {
		AND: [
			search
				? {
						name: {
							contains: search,
							mode: 'insensitive',
						},
					}
				: {},
			isActive !== undefined
				? {
						isActive,
					}
				: {},
		],
	}

	const { data, total } = await getShiftsRepo({ skip, take: limit, where })

	const formattedData = data.map(generateShiftResponse)

	return {
		data: formattedData,
		meta: {
			total: total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const createShiftService = async (data: TCreateShift) => {
	// Validamos que el turno no solape a otro turno ya existente
	const overlap = await findOverlappingShift(data.startTime, data.endTime)
	if (overlap) throw new AppError('SHIFT_OVERLAP')

	const shift = await createShiftRepo(data)
	return generateShiftResponse(shift)
}

export const updateShiftService = async (id: string, data: TUpdateShift) => {
	// Validamos que exista el turno
	const shift = await findShiftById(id)
	if (!shift) throw new AppError('SHIFT_NOT_FOUND')

	// Validamos que el turno no solape a otro turno ya existente diferente al que se está modificando
	const overlap = await findOverlappingShift(
		shift.startTime,
		shift.endTime,
		shift.id,
	)
	if (overlap) throw new AppError('SHIFT_OVERLAP')

	const updatedShift = await updateShiftRepo(id, data)
	return generateShiftResponse(updatedShift)
}

export const deleteShiftService = async (id: string) => {
	// Validamos que exista el turno
	const shift = await findShiftById(id)
	if (!shift) throw new AppError('SHIFT_NOT_FOUND')

	await deleteShiftRepo(id)

	return { message: 'El turno fue eliminado correctamente' }
}
