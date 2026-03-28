import { NextFunction, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { createMovementService, getMovementsService } from './movement.service'
import { movementQuerySchema, movementSchema } from './movement.schema'
import { MovementType } from '@prisma/client'

const createMovement = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
	type: MovementType,
) => {
	try {
		const validated = movementSchema.parse(req.body)
		const result = await createMovementService(req.user.id, type, validated)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const createEntry = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => createMovement(req, res, next, MovementType.IN)

export const createExit = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => createMovement(req, res, next, MovementType.OUT)

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
