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
	page: string
	limit: string
}
