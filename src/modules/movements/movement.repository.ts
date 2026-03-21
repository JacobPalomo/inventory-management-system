import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'

// Mover la operación desde el servicio
export const createMovementRepo = (data: any) => {
	return prisma.movement.create({ data })
}

export const getMovementsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.MovementWhereInput
}) => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.movement.findMany({
			where,
			include: {
				product: true,
				user: true,
			},
			skip,
			take,
			orderBy: {
				createdAt: 'desc',
			},
		}),
		prisma.movement.count(),
	])

	return { data, total }
}

// Sin uso - eliminar
export const getProductById = (id: string) => {
	return prisma.product.findUnique({ where: { id } })
}

export const updateProductStock = (id: string, stock: number) => {
	return prisma.product.update({
		where: { id },
		data: { stock },
	})
}
