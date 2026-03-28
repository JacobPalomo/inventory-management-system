import { MovementType, Prisma } from '@prisma/client'
import { TProductDetail } from '../products/product.types'

export const movementSelect = {
	id: true,
	productId: true,
	userId: true,
	type: true,
	quantity: true,
	cost: true,
	reason: true,
	createdAt: true,
	product: {
		select: {
			id: true,
			name: true,
			sku: true,
			barcode: true,
			stock: true,
			trackStock: true,
			isActive: true,
		},
	},
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	},
} satisfies Prisma.MovementSelect

export type TMovement = Prisma.MovementGetPayload<{
	select: typeof movementSelect
}>

export interface TCreateMovement {
	productId: string
	quantity: number
	cost?: number
	reason?: string
}

export interface TCreateMovementResult {
	movement: TMovement
	product: TProductDetail
}

export type TAdjustStockParams = {
	productId: string
	quantity: number
	reason: string
	userId: string
	cost?: number
}

export type TResolvedMovement = {
	type: MovementType
	quantity: number
}
