import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { movementSelect, TMovement } from './movement.types'

export const getMovementsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.MovementWhereInput
}): Promise<{ data: TMovement[]; total: number }> => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.movement.findMany({
			where,
			select: movementSelect,
			skip,
			take,
			orderBy: {
				createdAt: 'desc',
			},
		}),
		prisma.movement.count({ where }),
	])

	return { data, total }
}
