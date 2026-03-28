import { MovementType, Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PaginationResponse } from '../../shared/types/pagination'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { getMovementsRepo } from './movement.repository'
import { TMovementQuery } from './movement.schema'
import { applyMovementInTransaction } from './movement.helpers'
import { TCreateMovement, TCreateMovementResult, TMovement } from './movement.types'

export const createMovementService = async (
	userId: string,
	type: MovementType,
	data: TCreateMovement,
): Promise<TCreateMovementResult> => {
	return prisma.$transaction(tx =>
		applyMovementInTransaction({
			tx,
			userId,
			productId: data.productId,
			type,
			quantity: data.quantity,
			reason: data.reason,
			cost: data.cost,
		}),
	)
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
							{
								product: {
									sku: {
										contains: search,
										mode: 'insensitive',
									},
								},
							},
							{
								product: {
									barcode: {
										contains: search,
										mode: 'insensitive',
									},
								},
							},
							{
								user: {
									name: {
										contains: search,
										mode: 'insensitive',
									},
								},
							},
							{
								reason: {
									contains: search,
									mode: 'insensitive',
								},
							},
						],
					}
				: {},
			movementType ? { type: movementType } : {},
			productId ? { productId } : {},
			userId ? { userId } : {},
			dateFrom || dateTo
				? {
						createdAt: {
							...(dateFrom ? { gte: formatFromDate(dateFrom) } : {}),
							...(dateTo ? { lte: formatToDate(dateTo) } : {}),
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
