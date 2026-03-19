import { AppError } from '../../utils/AppError'
import {
	createProductRepo,
	getProductsRepo,
	getProductByIdRepo,
	updateProductRepo,
	deleteProductRepo,
} from './product.repository'

export const createProductService = async (data: any) => {
	return createProductRepo(data)
}

export const getProductsService = async (query: any) => {
	const page = parseInt(query.page) || 1
	const limit = parseInt(query.limit) || 10
	const skip = (page - 1) * limit

	const search = query.search || ''
	const isActive =
		query.isActive !== undefined ? query.isActive === 'true' : undefined

	const where: any = {
		AND: [
			search
				? {
						name: {
							contains: search,
							mode: 'insensitive',
						},
					}
				: {},
			isActive !== undefined ? { isActive } : {},
		],
	}

	const { data, total } = await getProductsRepo({
		skip,
		take: limit,
		where,
	})

	const lowStock = query.lowStock === 'true'

	const filteredData = lowStock ? data.filter(p => p.stock <= p.minStock) : data

	return {
		data: filteredData,
		meta: {
			total: total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const getProductByIdService = async (id: string) => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('Product not found', 404)
	}

	return product
}

export const updateProductService = async (id: string, data: any) => {
	return updateProductRepo(id, data)
}

export const deleteProductService = async (id: string) => {
	return deleteProductRepo(id)
}
