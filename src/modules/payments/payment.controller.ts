import { NextFunction, Request, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import {
	createPaymentSchema,
	paymentIdSchema,
	paymentsQuerySchema,
} from './payment.schema'
import {
	createPaymentService,
	getPaymentByIdService,
	getPaymentsService,
} from './payment.service'

export const createPayment = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validated = createPaymentSchema.parse(req.body)
		const result = await createPaymentService(req.user.id, validated)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const getPayments = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = paymentsQuerySchema.parse(req.query)
		const result = await getPaymentsService(query)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getPaymentById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = paymentIdSchema.parse(req.params)
		const payment = await getPaymentByIdService(params.id)

		res.json(payment)
	} catch (error) {
		next(error)
	}
}
