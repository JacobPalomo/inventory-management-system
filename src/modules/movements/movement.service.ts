import { prisma } from '../../config/prisma'
import { Prisma, MovementType } from '@prisma/client'
import { AppError } from '../../utils/AppError'
import { getMovementsRepo } from './movement.repository'
import { formatFromDate, formatToDate } from '../../utils/formatDate'

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

export const getMovementsService = async (query: any) => {
	const page = parseInt(query.page) || 1
	const limit = parseInt(query.limit) || 10
	const skip = (page - 1) * limit

	const { search, movementType, productId, userId, from, to } = query

	const where: any = {
		AND: [
			// filtrar búsqueda (en relaciones)
			search
				? {
						OR: [
							{
								product: {
									name: {
										contains: search,
										mode: 'insensitive',
									},
								},
							},
						],
					}
				: {},

			// filtrar por tipo de movimiento
			movementType
				? {
						type: movementType, // 'IN' | 'OUT'
					}
				: {},

			// filtrar por producto
			productId ? { productId } : {},

			// filtrar por usuario
			userId ? { userId } : {},

			// filtrar por rango de fechas
			from || to
				? {
						createdAt: {
							...(from && { gte: formatFromDate(new Date(from)) }),
							...(to && { lte: formatToDate(new Date(to)) }),
						},
					}
				: {},
		],
	}

	const { data, total } = await getMovementsRepo({
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
