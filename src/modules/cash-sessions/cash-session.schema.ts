import { CashSessionStatus } from '@prisma/client'
import z from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const cashSessionByIdParamsSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

export const cashSessionRegisterIdParamsSchema = z.object({
	registerId: z.uuid('No es un ID válido'),
})

const cashSessionFilterSchema = z
	.object({
		registerId: z.uuid('No es un ID válido').optional(),
		userId: z.uuid('No es un ID válido').optional(),
		status: z.enum(CashSessionStatus).optional(),
		openedFrom: z.coerce
			.date()
			.refine(date => !isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		openedTo: z.coerce
			.date()
			.refine(date => !isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		closedFrom: z.coerce
			.date()
			.refine(date => !isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		closedTo: z.coerce
			.date()
			.refine(date => !isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
	})
	.refine(
		data =>
			!data.openedFrom ||
			!data.openedTo ||
			data.openedFrom.getTime() <= data.openedTo.getTime(),
		{
			message: 'La fecha inicial de apertura no puede ser mayor que la final',
			path: ['openedFrom'],
		},
	)
	.refine(
		data =>
			!data.closedFrom ||
			!data.closedTo ||
			data.closedFrom.getTime() <= data.closedTo.getTime(),
		{
			message: 'La fecha inicial de cierre no puede ser mayor que la final',
			path: ['closedFrom'],
		},
	)

export const cashSessionQuerySchema = withPagination(cashSessionFilterSchema)

export type TCashSessionQuery = z.infer<typeof cashSessionQuerySchema>

export const createCashSessionSchema = z.object({
	registerId: z.uuid('No es un ID válido'),
	openingAmount: z.coerce
		.number('Debe ser un número válido')
		.nonnegative('No puede ser menor a 0'),
})

export type TCreateCashSession = z.infer<typeof createCashSessionSchema>

export const closeCashSessionSchema = z.object({
	countedAmount: z.coerce
		.number('Debe ser un número válido')
		.nonnegative('No puede ser menor a 0'),
})

export type TCloseCashSession = z.infer<typeof closeCashSessionSchema>
