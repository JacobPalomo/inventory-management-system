import { NextFunction, Request, Response } from 'express'
import {
	createCashRegisterService,
	getCashRegisterByIdService,
	getCashRegistersService,
	updateCashRegisterService,
} from './cash-register.service'
import {
	cashRegisterByIdParamsSchema,
	cashRegistersQuerySchema,
	createCashRegisterSchema,
	updateCashRegisterSchema,
} from './cash-register.schema'
import { AppError } from '../../shared/utils/AppError'
import { AuthRequest } from '../../middlewares/auth.middleware'

export const getCashRegisterById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const params = cashRegisterByIdParamsSchema.parse(req.params)

		const cashRegister = await getCashRegisterByIdService(params.id)

		res.status(200).json(cashRegister)
	} catch (error) {
		next(error)
	}
}

export const getCashRegisters = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = cashRegistersQuerySchema.parse(req.query)

		const cashRegisters = await getCashRegistersService(query)
		res.status(200).json(cashRegisters)
	} catch (error) {
		next(error)
	}
}

export const createCashRegister = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.body) throw new AppError('NO_BODY_ERROR')

		const parsedData = createCashRegisterSchema.parse(req.body)

		const cashRegister = await createCashRegisterService(
			req.user.id,
			parsedData,
		)

		res.status(201).json(cashRegister)
	} catch (error) {
		next(error)
	}
}

export const updateCashRegister = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.body) throw new AppError('NO_BODY_ERROR')

		const params = cashRegisterByIdParamsSchema.parse(req.params)
		const data = updateCashRegisterSchema.parse(req.body)

		const updatedCashRegister = await updateCashRegisterService(
			req.user.id,
			params.id,
			data,
		)

		res.status(200).json(updatedCashRegister)
	} catch (error) {
		next(error)
	}
}
