import { Request, Response } from 'express'
import { ShiftQuery, TCreateShift, TUpdateShift } from './shift.types'
import {
	createShiftService,
	deleteShiftService,
	getShiftsService,
	updateShiftService,
} from './shift.service'
import { createShiftSchema, updateShiftSchema } from './shift.schema'
import { AppError } from '../../utils/AppError'
import { timeToMinutes } from '../../utils/time'

export const getShifts = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		console.log(error)
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(error.statusCode).json({ message: error.message })
	}
}

export const createShift = async (req: Request, res: Response) => {
	try {
		if (!req.body.startTime || !req.body.endTime)
			throw new AppError('Falta hora de inicio u hora de termino del turno')

		// Convertimos el tiempo de entrada y de salida a minutos por ejemplo: de "08:00" a 480
		req.body.startTime = timeToMinutes(req.body.startTime)
		req.body.endTime = timeToMinutes(req.body.endTime)

		// Validamos el cuerpo de la solicitud
		const parsedData = createShiftSchema.parse(req.body) as TCreateShift

		const shift = await createShiftService(parsedData)
		res.status(201).json(shift)
	} catch (error: any) {
		console.log(error)
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(error.statusCode).json({ message: error.message })
	}
}

export const updateShift = async (req: Request, res: Response) => {
	try {
		// Validamos que exista el parametro ID
		const { id } = req.params as { id: string }
		if (!id) throw new AppError('Falta el parametro ID', 400)

		// Convertimos de minutos (number) a tiempo ("16:30") antes de la validación del cuerpo de la solicitud en caso de que se modifiquen estos datos
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
	} catch (error: any) {
		console.log(error)
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(error.statusCode).json({ message: error.message })
	}
}

export const deleteShift = async (req: Request, res: Response) => {
	try {
		// Validamos que exista el parametro ID
		const { id } = req.params as { id: string }
		if (!id) throw new AppError('Falta el parametro ID', 400)

		const result = await deleteShiftService(id)
		res.status(200).json(result)
	} catch (error: any) {
		console.log(error)
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(error.statusCode).json({ message: error.message })
	}
}
