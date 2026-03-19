import { prisma } from '../../config/prisma'

export const createMovementRepo = (data: any) => {
	return prisma.movement.create({ data })
}

export const getMovementsRepo = async (params: {
	skip: number
	take: number
	where: any
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

export const getProductById = (id: string) => {
	return prisma.product.findUnique({ where: { id } })
}

export const updateProductStock = (id: string, stock: number) => {
	return prisma.product.update({
		where: { id },
		data: { stock },
	})
}
