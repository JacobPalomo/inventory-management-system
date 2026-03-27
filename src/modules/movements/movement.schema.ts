import { z } from 'zod'
import { MovementType } from '@prisma/client'
import { withPagination } from '../../shared/schemas/pagination.schema'

const movementFilterSchema = z.object({
	search: z.string().optional(),
	movementType: z
		.enum(MovementType, 'No es un tipo movimiento válido')
		.optional(),
	productId: z.uuid('No es un ID válido').optional(),
	userId: z.uuid('No es un ID válido').optional(),
	dateFrom: z.coerce
		.date()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
	dateTo: z.coerce
		.date()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
})

export const movementQuerySchema = withPagination(movementFilterSchema)

export type TMovementQuery = z.infer<typeof movementQuerySchema>

export const movementSchema = z.object({
	productId: z.uuid(),
	quantity: z.number().int().positive(),
})
