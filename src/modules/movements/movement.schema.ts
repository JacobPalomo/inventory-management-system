import { z } from 'zod'

export const movementSchema = z.object({
	productId: z.uuid(),
	quantity: z.number().int().positive(),
})
