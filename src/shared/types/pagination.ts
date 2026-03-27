interface MetaPaginatedResponse {
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface PaginationResponse<T> {
	data: T[]
	meta: MetaPaginatedResponse
}

export interface PaginationQuery {
	page: number
	limit: number
}
