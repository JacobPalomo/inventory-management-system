import { z } from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const productIdSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

export const productBarcodeParamSchema = z.object({
	barcode: z
		.string()
		.trim()
		.min(1, 'El código de barras debe contener al menos 1 caracter')
		.max(100, 'El código de barras no puede contener más de 100 caracteres'),
})

export const createProductSchema = z
	.object({
		barcode: z
			.string()
			.trim()
			.min(1, 'El código de barras debe contener al menos 1 caracter')
			.max(100, 'El código de barras no puede contener más de 100 caracteres')
			.optional(),

		sku: z
			.string()
			.trim()
			.min(1, 'El SKU no puede ser menor que 1')
			.max(100, 'El SKU no puede contener más de 100 caracteres')
			.optional(),

		name: z
			.string()
			.trim()
			.min(1, 'El nombre del producto es requerido')
			.max(255, 'El nombre del producto no puede contener más 255 caracteres'),

		description: z
			.string()
			.trim()
			.max(
				1000,
				'La descripción del producto no puede contener más de 1000 caracteres',
			)
			.optional(),

		price: z
			.number('No es número válido')
			.positive('El precio debe ser mayor que 0'),

		cost: z
			.number('No es número válido')
			.nonnegative('El costo no puede ser negativo')
			.optional(),

		stock: z
			.number('No es número válido')
			.nonnegative('El stock no puede ser negativo')
			.optional(),

		minStock: z
			.number('No es número válido')
			.nonnegative('El stock mínimo no puede ser negativo')
			.optional(),

		maxStock: z
			.number('No es número válido')
			.nonnegative('El stock máximo no puede ser negativo')
			.optional(),

		taxRate: z
			.number('No es número válido')
			.min(0, 'El impuesto no puede ser menor que 0')
			.max(1, 'El impuesto no puede ser mayor que 1')
			.optional(),

		trackStock: z.boolean('No es un valor boleano válido').optional(),

		allowNegative: z.boolean('No es un valor boleano válido').optional(),

		isActive: z.boolean('No es un valor boleano válido').optional(),
	})
	.refine(
		data =>
			data.maxStock === undefined ||
			data.minStock === undefined ||
			data.maxStock >= data.minStock,
		{
			path: ['maxStock'],
			message: 'El stock máximo debe ser mayor o igual que el stock mínimo',
		},
	)

export type TCreateProduct = z.infer<typeof createProductSchema>

export const updateProductSchema = z.object({
	barcode: z
		.string()
		.trim()
		.min(1, 'El código de barras debe contener al menos 1 caracter')
		.max(100, 'El código de barras no puede contener más de 100 caracteres')
		.optional(),

	sku: z
		.string()
		.trim()
		.min(1, 'El SKU no puede ser menor que 1')
		.max(100, 'El SKU no puede contener más de 100 caracteres')
		.optional(),

	name: z
		.string()
		.trim()
		.min(1, 'El nombre del producto es requerido')
		.max(255, 'El nombre del producto no puede contener más 255 caracteres')
		.optional(),
	description: z
		.string()
		.trim()
		.max(
			1000,
			'La descripción del producto no puede contener más de 1000 caracteres',
		)
		.optional(),

	price: z
		.number('No es número válido')
		.positive('El precio debe ser mayor que 0')
		.optional(),

	taxRate: z
		.number('No es número válido')
		.min(0, 'El impuesto no puede ser menor que 0')
		.max(1, 'El impuesto no puede ser mayor que 1')
		.optional(),

	trackStock: z.boolean('No es un valor boleano válido').optional(),
	allowNegative: z.boolean('No es un valor boleano válido').optional(),

	isActive: z.boolean('No es un valor boleano válido').optional(),
})

export type TUpdateProductSchema = z.infer<typeof updateProductSchema>

export const updateProductInventoryConfigSchema = z
	.object({
		minStock: z
			.number('No es número válido')
			.nonnegative('El stock mínimo no puede ser negativo')
			.optional(),
		maxStock: z
			.number('No es número válido')
			.nonnegative('El stock máximo no puede ser negativo')
			.optional(),
	})
	.refine(
		data =>
			data.maxStock === undefined ||
			data.minStock === undefined ||
			data.maxStock >= data.minStock,
		{
			message: 'El stock máximo debe ser mayor o igual que el stock mínimo',
			path: ['maxStock'],
		},
	)

export type TUpdateProductInventoryConfig = z.infer<
	typeof updateProductInventoryConfigSchema
>

export const adjustProductStockSchema = z.object({
	quantity: z.number('No es número válido'),
	reason: z.string().min(1).max(255),
})

export type TAdjustProductStockSchema = z.infer<typeof adjustProductStockSchema>

const productsFilterSchema = z.object({
	search: z.string().trim().optional(),

	sortBy: z
		.enum(['name', 'price', 'stock', 'createdAt', 'updatedAt'])
		.optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),

	isActive: z.coerce.boolean('No es un valor boleano válido').optional(),
	trackStock: z.coerce.boolean('No es un valor boleano válido').optional(),
	lowStock: z.coerce.boolean('No es un valor boleano válido').optional(),
	outOfStock: z.coerce.boolean('No es un valor boleano válido').optional(),
	negativeStock: z.coerce.boolean('No es un valor boleano válido').optional(),

	minPrice: z
		.string()
		.transform(val => (val ? parseFloat(val) : undefined))
		.optional(),
	maxPrice: z
		.string()
		.transform(val => (val ? parseFloat(val) : undefined))
		.optional(),
})

export const productsQuerySchema = withPagination(productsFilterSchema)

export type TProductsQuery = z.infer<typeof productsQuerySchema>
