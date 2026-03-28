import { AuditAction, EntityType, MovementType, Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { AppError } from '../../shared/utils/AppError'
import { createAuditLog } from '../audit-logs/audit-log.helpers'
import { productDetailSelect } from '../products/product.types'
import {
	TAdjustStockParams,
	TCreateMovementResult,
	TResolvedMovement,
} from './movement.types'
import { movementSelect } from './movement.types'

const resolveMovementFromQuantity = (quantity: number): TResolvedMovement => {
	if (quantity === 0) {
		throw new AppError('INVALID_QUERY_PARAMS')
	}

	return {
		type: quantity > 0 ? MovementType.IN : MovementType.OUT,
		quantity: Math.abs(quantity),
	}
}

const resolveMovementCost = (params: {
	type: MovementType
	inputCost?: number
	productCost?: number | null
	productAvgCost?: number | null
}): number | null => {
	const { type, inputCost, productCost, productAvgCost } = params

	if (type === MovementType.IN) {
		return inputCost ?? productCost ?? productAvgCost ?? null
	}

	return productAvgCost ?? productCost ?? inputCost ?? null
}

const calculateNextAverageCost = (params: {
	currentStock: number
	currentAvgCost?: number | null
	incomingQuantity: number
	incomingCost?: number | null
}): number | null => {
	const { currentStock, currentAvgCost, incomingQuantity, incomingCost } = params

	if (incomingCost === undefined || incomingCost === null) {
		return currentAvgCost ?? null
	}

	if (currentStock <= 0 || currentAvgCost === undefined || currentAvgCost === null) {
		return incomingCost
	}

	const totalUnits = currentStock + incomingQuantity

	if (totalUnits <= 0) {
		return incomingCost
	}

	const weightedCost =
		currentStock * currentAvgCost + incomingQuantity * incomingCost

	return weightedCost / totalUnits
}

const serializeForAudit = (value: unknown): Prisma.JsonValue => {
	if (value instanceof Date) {
		return value.toISOString()
	}

	if (Array.isArray(value)) {
		return value.map(item => serializeForAudit(item))
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, serializeForAudit(item)]),
		) as Prisma.JsonObject
	}

	if (value === undefined) {
		return null
	}

	return value as Prisma.JsonValue
}

export const applyMovementInTransaction = async (params: {
	tx: Prisma.TransactionClient
	userId: string
	productId: string
	type: MovementType
	quantity: number
	reason?: string
	cost?: number
}): Promise<TCreateMovementResult> => {
	const { tx, userId, productId, type, quantity, reason, cost } = params

	const [user, product] = await Promise.all([
		tx.user.findUnique({
			where: { id: userId },
			select: { id: true },
		}),
		tx.product.findUnique({
			where: { id: productId },
			select: {
				id: true,
				stock: true,
				cost: true,
				avgCost: true,
				trackStock: true,
				allowNegative: true,
				isActive: true,
			},
		}),
	])

	if (!user) {
		throw new AppError('USER_NOT_FOUND')
	}

	if (!product || !product.isActive) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (!product.trackStock) {
		throw new AppError('PRODUCT_DOES_NOT_TRACK_STOCK')
	}

	const stockDelta = type === MovementType.IN ? quantity : -quantity
	const nextStock = product.stock + stockDelta

	if (!product.allowNegative && nextStock < 0) {
		throw new AppError('PRODUCT_INSUFFICIENT_STOCK')
	}

	const movementCost = resolveMovementCost({
		type,
		inputCost: cost,
		productCost: product.cost,
		productAvgCost: product.avgCost,
	})

	const nextAvgCost =
		type === MovementType.IN
			? calculateNextAverageCost({
					currentStock: product.stock,
					currentAvgCost: product.avgCost,
					incomingQuantity: quantity,
					incomingCost: movementCost,
				})
			: product.avgCost ?? null

	const updatedProduct = await tx.product.update({
		where: { id: productId },
		data: {
			stock: nextStock,
			...(type === MovementType.IN
				? {
						avgCost: nextAvgCost,
						...(cost !== undefined ? { cost } : {}),
					}
				: {}),
		},
		select: productDetailSelect,
	})

	const movement = await tx.movement.create({
		data: {
			productId,
			userId,
			type,
			quantity,
			cost: movementCost,
			reason: reason?.trim() || null,
		},
		select: movementSelect,
	})

	await createAuditLog(tx, {
		userId,
		action: AuditAction.STOCK_ADJUST,
		entity: EntityType.Movement,
		entityId: movement.id,
		oldValue: {
			product: serializeForAudit({
				id: product.id,
				stock: product.stock,
				cost: product.cost,
				avgCost: product.avgCost,
				trackStock: product.trackStock,
				allowNegative: product.allowNegative,
				isActive: product.isActive,
			}) as Prisma.JsonObject,
		},
		newValue: {
			movement: serializeForAudit(movement) as Prisma.JsonObject,
			product: serializeForAudit(updatedProduct) as Prisma.JsonObject,
		},
	})

	return {
		movement,
		product: updatedProduct,
	}
}

export const adjustStockWithMovementHelper = async (
	params: TAdjustStockParams,
) => {
	const { productId, quantity, reason, userId, cost } = params
	const resolvedMovement = resolveMovementFromQuantity(quantity)

	return prisma.$transaction(tx =>
		applyMovementInTransaction({
			tx,
			userId,
			productId,
			type: resolvedMovement.type,
			quantity: resolvedMovement.quantity,
			reason,
			cost,
		}),
	)
}
