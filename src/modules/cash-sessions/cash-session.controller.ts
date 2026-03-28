import { NextFunction, Request, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { AppError } from '../../shared/utils/AppError'
import {
	cashSessionByIdParamsSchema,
	cashSessionQuerySchema,
	cashSessionRegisterIdParamsSchema,
	closeCashSessionSchema,
	createCashSessionSchema,
} from './cash-session.schema'
import {
	closeCashSessionService,
	createCashSessionService,
	getActiveCashSessionByRegisterIdService,
	getCashSessionByIdService,
	getCashSessionsService,
	getMyActiveCashSessionService,
} from './cash-session.service'

export const getCashSessionById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = cashSessionByIdParamsSchema.parse(req.params)
		const cashSession = await getCashSessionByIdService(params.id)

		res.status(200).json(cashSession)
	} catch (error) {
		next(error)
	}
}

export const getCashSessions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = cashSessionQuerySchema.parse(req.query)
		const cashSessions = await getCashSessionsService(query)

		res.status(200).json(cashSessions)
	} catch (error) {
		next(error)
	}
}

export const getMyActiveCashSession = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const cashSession = await getMyActiveCashSessionService(req.user.id)

		res.status(200).json(cashSession)
	} catch (error) {
		next(error)
	}
}

export const getActiveCashSessionByRegisterId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = cashSessionRegisterIdParamsSchema.parse(req.params)
		const cashSession = await getActiveCashSessionByRegisterIdService(
			params.registerId,
		)

		res.status(200).json(cashSession)
	} catch (error) {
		next(error)
	}
}

export const createCashSession = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.body) throw new AppError('NO_BODY_ERROR')

		const data = createCashSessionSchema.parse(req.body)
		const cashSession = await createCashSessionService(req.user.id, data)

		res.status(201).json(cashSession)
	} catch (error) {
		next(error)
	}
}

export const closeCashSession = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.body) throw new AppError('NO_BODY_ERROR')

		const params = cashSessionByIdParamsSchema.parse(req.params)
		const data = closeCashSessionSchema.parse(req.body)

		const closedCashSession = await closeCashSessionService(
			params.id,
			req.user.id,
			data,
		)

		res.status(200).json(closedCashSession)
	} catch (error) {
		next(error)
	}
}
