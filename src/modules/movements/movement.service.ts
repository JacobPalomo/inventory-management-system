import { prisma } from '../../config/prisma'
import { Prisma, MovementType } from '@prisma/client'
import { AppError } from '../../utils/AppError'

export const createMovementService = async (
	userId: string,
	type: MovementType,
	productId: string,
	quantity: number,
) => {
	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const product = await tx.product.findUnique({
			where: { id: productId },
		})

		if (!product) {
			throw new AppError('Product not found', 404)
		}

		let newStock = product.stock

		if (type === 'IN') {
			newStock += quantity
		}

		if (type === 'OUT') {
			if (product.stock < quantity) {
				throw new AppError('Insufficient stock', 409)
			}
			newStock -= quantity
		}

		const updatedProduct = await tx.product.update({
			where: { id: productId },
			data: { stock: newStock },
		})

		const movement = await tx.movement.create({
			data: {
				type,
				quantity,
				productId,
				userId,
			},
		})

		return {
			movement,
			product: updatedProduct,
		}
	})
}

export const getMovementsService = async () => {
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
