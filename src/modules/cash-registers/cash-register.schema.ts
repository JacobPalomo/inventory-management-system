import z from 'zod'
import { withPagination } from '../../shared/schemas/pagination.schema'

export const cashRegisterByIdParamsSchema = z.object({
	id: z.uuid('No es un ID válido'),
})

const cashRegistersFilterSchema = z.object({
	name: z.string().optional(),
	isActive: z.coerce.boolean('No es un valor boleano válido').optional(),
})

export const cashRegistersQuerySchema = withPagination(
	cashRegistersFilterSchema,
)

export type TCashRegistersQuery = z.infer<typeof cashRegistersQuerySchema>

export const createCashRegisterSchema = z.object({
	name: z
		.string('El nombre debe contener texto')
		.min(3, 'Debe contener al menos 3 caracteres'),
	description: z
		.string('La descripción debe contener texto')
		.min(6, 'Debe contener al menos 6 caracteres')
		.optional(),
})

export type TCreateCashRegister = z.infer<typeof createCashRegisterSchema>

export const updateCashRegisterSchema = z.object({
	name: z.string().min(3, 'Debe contener al menos 3 caracteres').optional(),
	description: z
		.string('La descripción debe contener texto')
		.min(6, 'Debe contener al menos 6 caracteres')
		.optional(),
})

export type TUpdateCashRegister = z.infer<typeof updateCashRegisterSchema>
