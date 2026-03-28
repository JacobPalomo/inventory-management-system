import { z } from 'zod'
import { MovementType } from '@prisma/client'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const movementSchema = z.object({
	productId: z.uuid('No es un ID válido'),
	quantity: z.coerce
		.number('No es número válido')
		.int('La cantidad debe ser un número entero')
		.positive('La cantidad debe ser mayor que 0'),
	cost: z.coerce
		.number('No es número válido')
		.nonnegative('El costo no puede ser negativo')
		.optional(),
	reason: z
		.string()
		.trim()
		.min(1, 'La razón debe contener al menos 1 caracter')
		.max(255, 'La razón no puede contener más de 255 caracteres')
		.optional(),
})

export type TMovementSchema = z.infer<typeof movementSchema>

const movementFilterSchema = z
	.object({
		search: z.string().trim().optional(),
		movementType: z.enum(MovementType).optional(),
		productId: z.uuid('No es un ID válido').optional(),
		userId: z.uuid('No es un ID válido').optional(),
		dateFrom: z.coerce
			.date()
			.refine(date => !Number.isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		dateTo: z.coerce
			.date()
			.refine(date => !Number.isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
	})
	.refine(
		data =>
			!data.dateFrom || !data.dateTo || data.dateFrom.getTime() <= data.dateTo.getTime(),
		{
			message: 'La fecha inicial no puede ser mayor que la fecha final',
			path: ['dateFrom'],
		},
	)

export const movementQuerySchema = withPagination(movementFilterSchema)

export type TMovementQuery = z.infer<typeof movementQuerySchema>
