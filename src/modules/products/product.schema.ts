import { z } from 'zod'
import { TZodCreateProduct, TZodUpdateProduct } from './product.types'

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
