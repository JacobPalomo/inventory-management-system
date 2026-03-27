import { prisma } from '../../config/prisma'
import { Prisma, MovementType } from '@prisma/client'
import { AppError } from '../../shared/utils/AppError'
import { getMovementsRepo } from './movement.repository'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { PaginationResponse } from '../../shared/types/pagination'
import { TMovement } from './movement.types'
import { TMovementQuery } from './movement.schema'

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
			throw new AppError('PRODUCT_NOT_FOUND')
		}

		let newStock = product.stock

		if (type === 'IN') {
			newStock += quantity
		}

		if (type === 'OUT') {
			if (product.stock < quantity) {
				throw new AppError('PRODUCT_INSUFFICIENT_STOCK')
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

export const getMovementsService = async (
	query: TMovementQuery,
): Promise<PaginationResponse<TMovement>> => {
	const {
		page,
		limit,
		search,
		movementType,
		productId,
		userId,
		dateFrom,
		dateTo,
	} = query
	const skip = (page - 1) * limit

	const where: Prisma.MovementWhereInput = {
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
			dateFrom && dateTo
				? {
						createdAt: {
							...(dateFrom && { gte: formatFromDate(dateFrom) }),
							...(dateTo && { lte: formatToDate(dateTo) }),
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
