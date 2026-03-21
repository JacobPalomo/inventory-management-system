import { Product } from '@prisma/client'
import { AppError } from '../../utils/AppError'
import { PaginatedResponse } from '../../types/pagination'
import { ProductQuery, TCreateProduct, TUpdateProduct } from './product.types'
import {
	createProductRepo,
	getProductsRepo,
	getProductByIdRepo,
	updateProductRepo,
	deleteProductRepo,
} from './product.repository'

export const createProductService = async (
	data: TCreateProduct,
): Promise<Product> => {
	return createProductRepo(data)
}

export const getProductsService = async (
	query: ProductQuery,
): Promise<PaginatedResponse<Product>> => {
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

	const lowStock =
		query.lowStock !== undefined ? query.lowStock === 'true' : undefined

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

export const getProductByIdService = async (id: string): Promise<Product> => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	return product
}

export const updateProductService = async (
	id: string,
	data: TUpdateProduct,
): Promise<Product> => {
	return updateProductRepo(id, data)
}

export const deleteProductService = async (id: string) => {
	await deleteProductRepo(id)

	return { message: 'El producto fue eliminado correctamente' }
}
