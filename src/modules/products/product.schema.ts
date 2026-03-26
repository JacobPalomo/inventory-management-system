import { z } from 'zod'
import { TZodCreateProduct, TZodUpdateProduct } from './product.types'
import { withPagination } from '../../validations/pagination.schema'

export const createProductSchema = z.object<TZodCreateProduct>({
	name: z.string().min(3),
	description: z.string().optional(),
	stock: z.number().int().nonnegative(),
	minStock: z.number().int().nonnegative(),
})

export const updateProductSchema = z.object<TZodUpdateProduct>({
	name: z.string().min(3).optional(),
	description: z.string().optional(),
	stock: z.number().int().nonnegative().optional(),
	minStock: z.number().int().nonnegative().optional(),
})

const productsFilterSchema = z.object({
	search: z.uuid('No es un ID válido').optional(),
	isActive: z.coerce.boolean('No es un valor boleano válido').optional(),
	lowStock: z.coerce.boolean('No es un valor boleano válido').optional(),
})

export const productsQuerySchema = withPagination(productsFilterSchema)

export type TProductsQuery = z.infer<typeof productsQuerySchema>
