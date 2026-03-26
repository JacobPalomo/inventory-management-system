import { NextFunction, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { createMovementService, getMovementsService } from './movement.service'
import { movementQuerySchema, movementSchema } from './movement.schema'

export const createEntry = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productId, quantity } = movementSchema.parse(req.body)

		const result = await createMovementService(
			req.user.id,
			'IN',
			productId,
			quantity,
		)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const createExit = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productId, quantity } = movementSchema.parse(req.body)

		const result = await createMovementService(
			req.user.id,
			'OUT',
			productId,
			quantity,
		)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const getMovements = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const query = movementQuerySchema.parse(req.query)

		const movements = await getMovementsService(query)
		res.json(movements)
	} catch (error) {
		next(error)
	}
}
