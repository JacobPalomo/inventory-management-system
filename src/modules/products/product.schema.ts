import { z } from 'zod'

export const createProductSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
	stock: z.number().int().nonnegative(),
	minStock: z.number().int().nonnegative(),
})

export const updateProductSchema = z.object({
	name: z.string().min(3).optional(),
	description: z.string().optional(),
	stock: z.number().int().nonnegative().optional(),
	minStock: z.number().int().nonnegative().optional(),
})
