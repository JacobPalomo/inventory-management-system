import z from 'zod'

interface MetaPaginatedResponse {
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface PaginatedResponse<T> {
	data: T[]
	meta: MetaPaginatedResponse
}

export interface PaginationQuery {
	page: number
	limit: number
}

export interface TZodPaginationQuery {
	page: z.ZodNumber
	limit: z.ZodNumber
}
