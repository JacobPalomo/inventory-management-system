import { Prisma } from '@prisma/client'
import { AppError } from '../../shared/utils/AppError'
import { PaginationResponse } from '../../shared/types/pagination'

import {
	createProductRepo,
	getProductsRepo,
	getProductByIdRepo,
	updateProductRepo,
	deleteProductRepo,
	getProductsLowStockRepo,
	getProductByBarcodeRepo,
	getProductBySkuRepo,
	restoreProductRepo,
} from './product.repository'

import {
	TCreateProduct,
	TProductsQuery,
	TUpdateProductSchema,
} from './product.schema'

import { TProductDetail, TProductList } from './product.types'
import { adjustStockWithMovementHelper } from '../movements/movement.helpers'

export const createProductService = async (
	data: TCreateProduct,
): Promise<TProductDetail> => {
	// validar barcode único
	if (data.barcode) {
		const exists = await getProductByBarcodeRepo(data.barcode)

		if (exists) {
			throw new AppError('PRODUCT_ALREADY_EXISTS')
		}
	}

	// validar sku único
	if (data.sku) {
		const exists = await getProductBySkuRepo(data.sku)

		if (exists) {
			throw new AppError('PRODUCT_ALREADY_EXISTS')
		}
	}

	return createProductRepo(data)
}

export const getProductsService = async (
	query: TProductsQuery,
): Promise<PaginationResponse<TProductList>> => {
	const {
		page,
		limit,
		search,
		isActive,
		trackStock,
		lowStock,
		outOfStock,
		negativeStock,
		sortBy,
		sortOrder,
		minPrice,
		maxPrice,
	} = query

	const skip = (page - 1) * limit

	if (lowStock) {
		if (outOfStock) {
			throw new AppError('INVALID_QUERY_PARAMS')
		}

		if (negativeStock) {
			throw new AppError('INVALID_QUERY_PARAMS')
		}

		const { data, total } = await getProductsLowStockRepo({
			skip,
			take: limit,
		})

		return {
			data,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	const where: Prisma.ProductWhereInput = {
		AND: [
			search
				? {
						OR: [
							{ name: { contains: search, mode: 'insensitive' } },
							{ sku: { contains: search, mode: 'insensitive' } },
							{ barcode: { contains: search, mode: 'insensitive' } },
						],
					}
				: {},

			{ isActive: isActive ?? true },

			trackStock !== undefined ? { trackStock } : {},

			minPrice !== undefined || maxPrice !== undefined
				? {
						price: {
							gte: minPrice,
							lte: maxPrice,
						},
					}
				: {},

			outOfStock ? { stock: 0 } : {},

			negativeStock ? { stock: { lt: 0 } } : {},
		],
	}

	const orderBy: Prisma.ProductOrderByWithRelationInput | undefined = sortBy
		? { [sortBy]: sortOrder ?? 'asc' }
		: { createdAt: 'desc' }

	const { data, total } = await getProductsRepo({
		skip,
		take: limit,
		where,
		orderBy,
	})

	const filteredData = lowStock ? data.filter(p => p.stock <= p.minStock) : data

	return {
		data: filteredData,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const getProductByIdService = async (
	id: string,
): Promise<TProductDetail> => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (!product.isActive) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	return product
}

export const getProductByBarcodeService = async (
	barcode: string,
): Promise<TProductDetail> => {
	const product = await getProductByBarcodeRepo(barcode)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	return product
}

export const updateProductService = async (
	id: string,
	data: TUpdateProductSchema,
): Promise<TProductDetail> => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (!product.isActive) {
		throw new AppError('PRODUCT_ALREADY_DELETED')
	}

	if (data.barcode) {
		const exists = await getProductByBarcodeRepo(data.barcode)

		if (exists && exists.id !== id) {
			throw new AppError('PRODUCT_ALREADY_EXISTS')
		}
	}

	if (data.sku) {
		const exists = await getProductBySkuRepo(data.sku)

		if (exists && exists.id !== id) {
			throw new AppError('PRODUCT_ALREADY_EXISTS')
		}
	}

	return updateProductRepo(id, data)
}

export const adjustProductStockService = async (
	id: string,
	quantity: number,
	reason: string,
	userId: string,
) => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (!product.trackStock) {
		throw new AppError('INVALID_QUERY_PARAMS')
	}

	return adjustStockWithMovementHelper({
		productId: id,
		quantity,
		reason,
		userId,
	})
}

export const deleteProductService = async (id: string) => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (!product.isActive) {
		throw new AppError('PRODUCT_ALREADY_DELETED')
	}

	await deleteProductRepo(id)

	return {
		message: 'El producto fue eliminado correctamente',
	}
}

export const restoreProductService = async (
	id: string,
): Promise<TProductDetail> => {
	const product = await getProductByIdRepo(id)

	if (!product) {
		throw new AppError('PRODUCT_NOT_FOUND')
	}

	if (product.isActive) {
		throw new AppError('PRODUCT_ALREADY_EXISTS')
	}

	return restoreProductRepo(id)
}
