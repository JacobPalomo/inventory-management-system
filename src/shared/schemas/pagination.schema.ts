import z from 'zod'

export const paginationSchema = z.object({
	page: z.coerce
		.number('No es número válido')
		.int('No es un número entero')
		.min(1, 'El valor mínimo permitido es 1')
		.default(1),

	limit: z.coerce
		.number('No es número válido')
		.int('No es un número entero')
		.min(1, 'El valor mínimo permitido es 1')
		.max(100, 'El valor máximo permitido es 100')
		.default(10),
})

export type TPaginationQuery = z.infer<typeof paginationSchema>

export const withPagination = <T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
) => schema.extend(paginationSchema.shape)
