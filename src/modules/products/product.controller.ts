import { Request, Response } from 'express'
import {
	createProductService,
	getProductsService,
	getProductByIdService,
	updateProductService,
	deleteProductService,
} from './product.service'
import { createProductSchema, updateProductSchema } from './product.schema'

export const createProduct = async (req: Request, res: Response) => {
	try {
		const validated = createProductSchema.parse(req.body)
		const product = await createProductService(validated)
		res.status(201).json(product)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const getProducts = async (req: Request, res: Response) => {
	try {
		const result = await getProductsService(req.query)
		res.json(result)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const getProductById = async (req: Request, res: Response) => {
	try {
		const product = await getProductByIdService(req.params.id as string)
		res.json(product)
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const validated = updateProductSchema.parse(req.body)
		const product = await updateProductService(
			req.params.id as string,
			validated,
		)
		res.json(product)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		await deleteProductService(req.params.id as string)
		res.json({ message: 'Product deleted' })
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}
