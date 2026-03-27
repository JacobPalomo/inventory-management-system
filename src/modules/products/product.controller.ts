import { NextFunction, Request, Response } from 'express'
import { TCreateProduct, TUpdateProduct } from './product.types'
import {
	createProductService,
	getProductsService,
	getProductByIdService,
	updateProductService,
	deleteProductService,
} from './product.service'
import {
	createProductSchema,
	productsQuerySchema,
	updateProductSchema,
} from './product.schema'

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = createProductSchema.parse(req.body) as TCreateProduct
		const product = await createProductService(validated)
		res.status(201).json(product)
	} catch (error) {
		next(error)
	}
}

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = productsQuerySchema.parse(req.query)

		const result = await getProductsService(query)
		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getProductById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const product = await getProductByIdService(req.params.id as string)
		res.json(product)
	} catch (error) {
		next(error)
	}
}

export const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = updateProductSchema.parse(req.body) as TUpdateProduct
		const product = await updateProductService(
			req.params.id as string,
			validated,
		)
		res.json(product)
	} catch (error) {
		next(error)
	}
}

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		await deleteProductService(req.params.id as string)
		res.json({ message: 'Product deleted' })
	} catch (error) {
		next(error)
	}
}
