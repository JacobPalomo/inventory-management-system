import { NextFunction, Request, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import {
	createRefundSchema,
	refundIdSchema,
	refundsQuerySchema,
} from './refund.schema'
import {
	createRefundService,
	getRefundByIdService,
	getRefundsService,
} from './refund.service'

export const createRefund = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = createRefundSchema.parse(req.body)
		const result = await createRefundService(req.user.id, validated)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const getRefunds = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = refundsQuerySchema.parse(req.query)
		const result = await getRefundsService(query)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getRefundById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = refundIdSchema.parse(req.params)
		const refund = await getRefundByIdService(params.id)

		res.json(refund)
	} catch (error) {
		next(error)
	}
}
