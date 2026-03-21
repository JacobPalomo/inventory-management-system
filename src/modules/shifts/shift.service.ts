import { Prisma } from '@prisma/client'
import {
	ShiftQuery,
	ShiftResponse,
	TCreateShift,
	TUpdateShift,
} from './shift.types'
import {
	createShiftRepo,
	deleteShiftRepo,
	findOverlappingShift,
	findShiftById,
	getShiftsRepo,
	updateShiftRepo,
} from './shift.repository'
import { PaginatedResponse } from '../../types/pagination'
import { AppError } from '../../utils/AppError'
import { generateShiftResponse } from './shift.utils'

export const getShiftsService = async (
	query: ShiftQuery,
): Promise<PaginatedResponse<ShiftResponse>> => {
	const page = parseInt(query.page) || 1
	const limit = parseInt(query.limit) || 10
	const skip = (page - 1) * limit

	const search = query.search || ''
	const isActive =
		query.isActive !== undefined ? query.isActive === 'true' : undefined

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
