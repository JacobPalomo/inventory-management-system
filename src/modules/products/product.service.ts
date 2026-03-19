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

export const getProductsService = async () => {
	return getProductsRepo()
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
