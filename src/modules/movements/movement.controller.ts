import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { createMovementService, getMovementsService } from './movement.service'
import { movementSchema } from './movement.schema'

export const createEntry = async (req: AuthRequest, res: Response) => {
	try {
		const { productId, quantity } = movementSchema.parse(req.body)

		const result = await createMovementService(
			req.user.id,
			'IN',
			productId,
			quantity,
		)

		res.status(201).json(result)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const createExit = async (req: AuthRequest, res: Response) => {
	try {
		const { productId, quantity } = movementSchema.parse(req.body)

		const result = await createMovementService(
			req.user.id,
			'OUT',
			productId,
			quantity,
		)

		res.status(201).json(result)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const getMovements = async (req: AuthRequest, res: Response) => {
	const movements = await getMovementsService(req.query)
	res.json(movements)
}
