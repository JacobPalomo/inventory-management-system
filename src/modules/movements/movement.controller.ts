import { NextFunction, Response } from 'express'
import { MovementType } from '@prisma/client'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { createMovementService, getMovementsService } from './movement.service'
import { movementSchema } from './movement.schema'
import { MovementQuery } from './movement.types'

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
		const { page, limit, search, movementType, productId, userId, from, to } =
			req.query

		const query: MovementQuery = {
			page: page as string,
			limit: limit as string,
			search: search as string,
			movementType: movementType as MovementType,
			productId: productId as string,
			userId: userId as string,
			from: new Date(from as string),
			to: new Date(to as string),
		}

		const movements = await getMovementsService(query)
		res.json(movements)
	} catch (error) {
		next(error)
	}
}
