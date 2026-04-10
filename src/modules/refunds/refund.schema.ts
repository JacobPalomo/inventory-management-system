import { PaymentMethod } from '@prisma/client'
import z from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const refundIdSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

const refundsFilterSchema = z
	.object({
		saleId: z.uuid('No es un ID válido').optional(),
		sessionId: z.uuid('No es un ID válido').optional(),
		userId: z.uuid('No es un ID válido').optional(),
		method: z.enum(PaymentMethod).optional(),
		dateFrom: z.coerce
			.date()
			.refine(date => !Number.isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		dateTo: z.coerce
			.date()
			.refine(date => !Number.isNaN(date.getTime()), 'Fecha inválida')
			.optional(),
		sortBy: z.enum(['createdAt', 'amount', 'method']).default('createdAt'),
		sortOrder: z.enum(['asc', 'desc']).default('desc'),
	})
	.refine(
		data =>
			!data.dateFrom || !data.dateTo || data.dateFrom.getTime() <= data.dateTo.getTime(),
		{
			message: 'La fecha inicial no puede ser mayor que la fecha final',
			path: ['dateFrom'],
		},
	)

export const refundsQuerySchema = withPagination(refundsFilterSchema)

export type TRefundsQuery = z.infer<typeof refundsQuerySchema>

export const createRefundItemSchema = z.object({
	saleItemId: z.uuid('No es un ID válido'),
	quantity: z.coerce
		.number('No es un número válido')
		.int('No es un número entero')
		.min(1, 'No puede ser menor que 1'),
})

export const createRefundSchema = z.object({
	saleId: z.uuid('No es un ID válido'),
	method: z.enum(PaymentMethod),
	reference: z
		.string()
		.trim()
		.min(1, 'La referencia debe contener al menos 1 caracter')
		.max(255, 'La referencia no puede contener más de 255 caracteres')
		.optional(),
	reason: z
		.string()
		.trim()
		.min(1, 'El motivo debe contener al menos 1 caracter')
		.max(500, 'El motivo no puede contener más de 500 caracteres')
		.optional(),
	items: z
		.array(createRefundItemSchema)
		.min(1, 'Debes incluir al menos 1 item a devolver'),
}).refine(
	data => new Set(data.items.map(item => item.saleItemId)).size === data.items.length,
	{
		message: 'No puedes repetir el mismo item de venta en una misma devolución',
		path: ['items'],
	},
)

export type TCreateRefund = z.infer<typeof createRefundSchema>
