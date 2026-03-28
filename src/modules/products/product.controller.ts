import { NextFunction, Request, Response } from 'express'

import {
	createProductService,
	getProductsService,
	getProductByIdService,
	updateProductService,
	deleteProductService,
	restoreProductService,
	getProductByBarcodeService,
	adjustProductStockService,
} from './product.service'

import {
	adjustProductStockSchema,
	createProductSchema,
	productBarcodeParamSchema,
	productIdSchema,
	productsQuerySchema,
	updateProductSchema,
} from './product.schema'
import { AuthRequest } from '../../middlewares/auth.middleware'

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = createProductSchema.parse(req.body)

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
		const params = productIdSchema.parse(req.params)

		const product = await getProductByIdService(params.id)

		res.json(product)
	} catch (error) {
		next(error)
	}
}

export const getProductByBarcode = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = productBarcodeParamSchema.parse(req.params)

		const product = await getProductByBarcodeService(params.barcode)

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
		const params = productIdSchema.parse(req.params)
		const validated = updateProductSchema.parse(req.body)

		const product = await updateProductService(params.id, validated)

		res.json(product)
	} catch (error) {
		next(error)
	}
}

export const adjustProductStock = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = productIdSchema.parse(req.params)
		const validated = adjustProductStockSchema.parse(req.body)

		const product = await adjustProductStockService(
			params.id,
			validated.quantity,
			validated.reason,
			req.user.id,
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
		const params = productIdSchema.parse(req.params)

		const result = await deleteProductService(params.id)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const restoreProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = productIdSchema.parse(req.params)

		const product = await restoreProductService(params.id)

		res.json(product)
	} catch (error) {
		next(error)
	}
}
