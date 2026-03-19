import { prisma } from '../../config/prisma'

export const createMovementRepo = (data: any) => {
	return prisma.movement.create({ data })
}

export const getMovementsRepo = () => {
	return prisma.movement.findMany({
		include: {
			product: true,
			user: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
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
