import { SaleItemStatus, SaleStatus } from '@prisma/client'
import z from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const saleIdSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

const salesFilterSchema = z
	.object({
		status: z.enum(SaleStatus).optional(),

		userId: z.uuid('No es un ID válido').optional(),
		sessionId: z.uuid('No es un ID válido').optional(),
		customerId: z.uuid('No es un ID válido').optional(),

		isVoided: z.coerce.boolean('No es un valor boleano válido').optional(),
		isCancelled: z.coerce.boolean('No es un valor boleano válido').optional(),

		sessionOpen: z.coerce.boolean('No es un valor boleano válido').optional(),

		dateFrom: z.coerce
			.date()
			.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
			.optional(),
		dateTo: z.coerce
			.date()
			.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
			.optional(),
		today: z.coerce.boolean('No es un valor boleano válido').optional(),

		minTotal: z.coerce
			.number('No es un número válido')
			.nonnegative('No puede ser un número negativo')
			.optional(),
		maxTotal: z.coerce
			.number('No es un número válido')
			.nonnegative('No puede ser un número negativo')
			.optional(),

		productId: z.uuid('No es un ID válido').optional(),
		itemStatus: z.enum(SaleItemStatus).optional(),
		itemVoided: z.coerce.boolean('No es un valor boleano válido').optional(),

		withItems: z.coerce.boolean('No es un valor boleano válido').optional(),

		sortBy: z
			.enum(['createdAt', 'total', 'subtotal', 'tax', 'discount', 'status'])
			.default('createdAt'),

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
	.refine(
		data =>
			data.minTotal === undefined ||
			data.maxTotal === undefined ||
			data.minTotal <= data.maxTotal,
		{
			message: 'El total mínimo no puede ser mayor que el total máximo',
			path: ['minTotal'],
		},
	)

export const salesQuerySchema = withPagination(salesFilterSchema)

export type TSalesQuery = z.infer<typeof salesQuerySchema>

export const createSaleSchema = z.object({
	sessionId: z.uuid('No es un ID válido').optional(),
	customerId: z.uuid('No es un ID válido').optional(),
	notes: z
		.string()
		.trim()
		.min(1, 'Las notas deben contener al menos 1 caracter')
		.max(500, 'Las notas no pueden contener más de 500 caracteres')
		.optional(),
})

export type TCreateSale = z.infer<typeof createSaleSchema>

export const addItemToSaleParamsSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

export const addItemToSaleSchema = z.object({
	productId: z.uuid('No es un ID válido'),
	quantity: z.coerce
		.number('No es un número válido')
		.int('No es un número entero')
		.min(1, 'No puede ser menor que 1'),
	price: z.coerce
		.number('No es número válido')
		.positive('Debe ser mayor que 0')
		.optional(),
	discount: z.coerce
		.number('No es número válido')
		.min(0, 'No puede ser menor que 0')
		.default(0),
})

export type TAddItemToSale = z.infer<typeof addItemToSaleSchema>
