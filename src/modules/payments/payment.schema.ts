import { PaymentMethod } from '@prisma/client'
import z from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const paymentIdSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

const paymentsFilterSchema = z
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

export const paymentsQuerySchema = withPagination(paymentsFilterSchema)

export type TPaymentsQuery = z.infer<typeof paymentsQuerySchema>

export const createPaymentSchema = z.object({
	saleId: z.uuid('No es un ID válido'),
	method: z.enum(PaymentMethod),
	amount: z.coerce
		.number('No es un número válido')
		.positive('El monto debe ser mayor que 0'),
	reference: z
		.string()
		.trim()
		.min(1, 'La referencia debe contener al menos 1 caracter')
		.max(255, 'La referencia no puede contener más de 255 caracteres')
		.optional(),
})

export type TCreatePayment = z.infer<typeof createPaymentSchema>
