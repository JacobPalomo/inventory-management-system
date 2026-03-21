import { z } from 'zod'
import { TZodMovement } from './movement.types'

export const movementSchema = z.object<TZodMovement>({
	productId: z.uuid(),
	quantity: z.number().int().positive(),
})
