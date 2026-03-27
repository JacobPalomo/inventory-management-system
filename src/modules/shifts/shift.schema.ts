import z from 'zod'
import { TZodCreateShift, TZodUpdateShift } from './shift.types'
import { withPagination } from '../../shared/schemas/pagination.schema'

const shiftsFilterSchema = z.object({
	search: z.string().optional(),
	isActive: z.coerce.boolean('No es un valor boleano válido').optional(),
})

export const shiftsQuerySchema = withPagination(shiftsFilterSchema)

export type TShiftsQuery = z.infer<typeof shiftsQuerySchema>

export const createShiftSchema = z.object<TZodCreateShift>({
	name: z
		.string()
		.min(3, 'El nombre del turno debe contener al menos 3 caracteres'),
	startTime: z
		.number()
		.int('La hora de inicio de turno debe ser un número entero (minutos)')
		.nonnegative('La hora de inicio de turno no puede ser un número negativo'),
	endTime: z
		.number()
		.int('La hora de término de turno debe ser un número entero (minutos)')
		.nonnegative('La hora de término de turno no puede ser un número negativo'),
})

export const updateShiftSchema = z.object<TZodUpdateShift>({
	name: z
		.string()
		.min(3, 'El nombre del turno debe contener al menos 3 caracteres')
		.optional(),
	startTime: z
		.number()
		.int('La hora de inicio de turno debe ser un número entero (minutos)')
		.nonnegative('La hora de inicio de turno no puede ser un número negativo')
		.optional(),
	endTime: z
		.number()
		.int('La hora de término de turno debe ser un número entero (minutos)')
		.nonnegative('La hora de término de turno no puede ser un número negativo')
		.optional(),
	isActive: z.boolean().optional(),
})
