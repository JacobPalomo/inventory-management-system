import z from 'zod'
import { PaginationQuery } from '../../types/pagination'
import { MovementType } from '@prisma/client'

export interface MovementQuery extends PaginationQuery {
	userId?: string
	productId?: string
	search?: string
	movementType?: MovementType
	from?: Date
	to?: Date
}

export interface TZodMovement {
	productId: z.ZodUUID
	quantity: z.ZodNumber
}

export interface TMovement {
	productId: string
	quantity: number
}
