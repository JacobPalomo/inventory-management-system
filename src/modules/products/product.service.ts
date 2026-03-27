import { Product } from '@prisma/client'
import { AppError } from '../../utils/AppError'
import { PaginationResponse } from '../../types/pagination'
import { TCreateProduct, TUpdateProduct } from './product.types'
import {
	createProductRepo,
	getProductsRepo,
	getProductByIdRepo,
	updateProductRepo,
	deleteProductRepo,
} from './product.repository'
import { TProductsQuery } from './product.schema'

export const createProductService = async (
	data: TCreateProduct,
): Promise<Product> => {
	return createProductRepo(data)
}

export const getProductsService = async (
	query: TProductsQuery,
): Promise<PaginationResponse<Product>> => {
	const { page, limit, search, isActive, lowStock } = query
	const skip = (page - 1) * limit

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
