import z from 'zod'
import { TZodPaginationQuery } from '../types/pagination'

export const validatePaginateQuerySchema = z.object<TZodPaginationQuery>({
	page: z
		.int('Debe ser un número entero')
		.nonnegative('No puede ser menor que 0'),
	limit: z
		.int('Debe ser un número entero')
		.nonnegative('No puede ser menor que 0'),
})
