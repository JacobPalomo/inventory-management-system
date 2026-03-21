import { NextFunction, Request, Response } from 'express'
import { ShiftQuery, TCreateShift, TUpdateShift } from './shift.types'
import {
	createShiftService,
	deleteShiftService,
	getShiftsService,
	updateShiftService,
} from './shift.service'
import { createShiftSchema, updateShiftSchema } from './shift.schema'
import { timeToMinutes } from '../../utils/time'

export const getShifts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { page, limit, search, isActive } = req.query

		const query: ShiftQuery = {
			page: page as string,
			limit: limit as string,
			search: search as string,
			isActive: isActive as string,
		}

		const result = await getShiftsService(query)
		res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}

export const createShift = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Convertimos el tiempo de entrada y de salida a minutos por ejemplo: de "08:00" a 480
		if (req.body.startTime) {
			req.body.startTime = timeToMinutes(req.body.startTime)
		}

		if (req.body.endTime) {
			req.body.endTime = timeToMinutes(req.body.endTime)
		}

		// Validamos el cuerpo de la solicitud
		const parsedData = createShiftSchema.parse(req.body) as TCreateShift

		const shift = await createShiftService(parsedData)
		res.status(201).json(shift)
	} catch (error) {
		next(error)
	}
}

export const updateShift = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params as { id: string }

		// Convertimos el tiempo de entrada y de salida a minutos por ejemplo: de "08:00" a 480
		if (req.body.startTime) {
			req.body.startTime = timeToMinutes(req.body.startTime)
		}

		if (req.body.endTime) {
			req.body.endTime = timeToMinutes(req.body.endTime)
		}

		// Validamos el cuerpo de la solicitud
		const parsedData = updateShiftSchema.parse(req.body) as TUpdateShift

		const updatedShift = await updateShiftService(id, parsedData)
		res.status(200).json(updatedShift)
	} catch (error) {
		next(error)
	}
}

export const deleteShift = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params as { id: string }

		const result = await deleteShiftService(id)
		res.status(200).json(result)
	} catch (error) {
		next(error)
	}
}
