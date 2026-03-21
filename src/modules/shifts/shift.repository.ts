import { prisma } from '../../config/prisma'
import { TCreateShift, TUpdateShift } from './shift.types'

export const findShiftById = async (id: string) => {
	return prisma.shift.findUnique({ where: { id } })
}

export const findOverlappingShift = async (
	startTime: number,
	endTime: number,
	excludeId?: string,
) => {
	return prisma.shift.findFirst({
		where: {
			AND: [
				{
					startTime: {
						lt: endTime,
					},
				},
				{
					endTime: {
						gt: startTime,
					},
				},
				excludeId
					? {
							NOT: {
								id: excludeId,
							},
						}
					: {},
			],
		},
	})
}

export const getShiftsRepo = async (params: {
	skip: number
	take: number
	where: any
}) => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.shift.findMany({
			where,
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.shift.count(),
	])

	return { data, total }
}

export const createShiftRepo = async (data: TCreateShift) => {
	return await prisma.shift.create({ data })
}

export const updateShiftRepo = async (id: string, data: TUpdateShift) => {
	return await prisma.shift.update({ where: { id }, data })
}

export const deleteShiftRepo = async (id: string) => {
	return await prisma.shift.delete({ where: { id } })
}
