import { NextFunction, Request, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import {
	addItemToSaleParamsSchema,
	addItemToSaleSchema,
	createSaleSchema,
	saleIdSchema,
	salesQuerySchema,
} from './sale.schema'
import {
	addItemToSaleService,
	createSaleService,
	getSaleByIdService,
	getSalesService,
} from './sale.service'

export const createSale = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = createSaleSchema.parse(req.body)
		const sale = await createSaleService(req.user.id, validated)

		res.status(201).json(sale)
	} catch (error) {
		next(error)
	}
}

export const getSales = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = salesQuerySchema.parse(req.query)
		const result = await getSalesService(query)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getSaleById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = saleIdSchema.parse(req.params)
		const sale = await getSaleByIdService(params.id)

		res.json(sale)
	} catch (error) {
		next(error)
	}
}

export const addItemToSale = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = addItemToSaleParamsSchema.parse(req.params)
		const validated = addItemToSaleSchema.parse(req.body)

		const sale = await addItemToSaleService({
			saleId: params.id,
			userId: req.user.id,
			data: validated,
		})

		res.status(201).json(sale)
	} catch (error) {
		next(error)
	}
}
