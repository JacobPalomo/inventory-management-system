import { Request, Response } from 'express'
import {
	adminUpdatePasswordSchema,
	createUserSchema,
	updatePasswordSchema,
	updateUserSchema,
} from './user.schema'
import {
	adminUpdatePasswordService,
	createUserService,
	deleteUserService,
	getUsersService,
	updatePasswordService,
	updateUserService,
} from './user.service'
import {
	TAdminUpdatePassword,
	TCreateUser,
	TUpdatePassword,
	TUpdateUser,
	UserQuery,
} from './user.types'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { AppError } from '../../utils/AppError'

export const getUsers = async (req: Request, res: Response) => {
	try {
		const { page, limit, search } = req.query

		const query: UserQuery = {
			page: page as string,
			limit: limit as string,
			search: search as string,
		}

		const result = await getUsersService(query)
		res.json(result)
	} catch (error: any) {
		console.log(error)
		res.status(400).json({ error: error.message })
	}
}

export const createUser = async (req: AuthRequest, res: Response) => {
	try {
		const data = req.body
		data.createdById = req.user.id

		// Validamos el cuerpo de la solicitud
		const parsedData = createUserSchema.parse(req.body) as TCreateUser

		const user = await createUserService(parsedData)
		res.status(201).json(user)
	} catch (error: any) {
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(400).json({ message: error.message })
	}
}

export const updateUser = async (req: Request, res: Response) => {
	try {
		// Validamos que exista el parametro ID
		const { id } = req.params as { id: string }
		if (!id) throw new AppError('Falta parametro ID')

		// Validamos el cuerpo de la solicitud
		const parsedData = updateUserSchema.parse(req.body) as TUpdateUser

		const updatedUser = await updateUserService(id, parsedData)
		res.status(200).json(updatedUser)
	} catch (error: any) {
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(400).json({ message: error.message })
	}
}

export const updateMyPassword = async (req: AuthRequest, res: Response) => {
	try {
		// Validamos cuerpo de la solicitud
		const parsedData = updatePasswordSchema.parse(req.body) as TUpdatePassword

		const result = await updatePasswordService(
			req.user.id as string,
			parsedData,
		)
		res.status(200).json(result)
	} catch (error: any) {
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(400).json({ message: error.message })
	}
}

export const adminUpdatePassword = async (req: Request, res: Response) => {
	try {
		// Validamos que exista el parametro ID
		const { id } = req.params as { id: string }
		if (!id) throw new AppError('Falta parametro ID')

		// Validamos el cuerpo de la solicitud
		const parsedData = adminUpdatePasswordSchema.parse(
			req.body,
		) as TAdminUpdatePassword

		const result = await adminUpdatePasswordService(id, parsedData)
		res.status(200).json(result)
	} catch (error: any) {
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(400).json({ message: error.message })
	}
}

export const deleteUser = async (req: Request, res: Response) => {
	try {
		// Validamos que exista el parametro ID
		const { id } = req.params as { id: string }
		if (!id) throw new AppError('Falta id de usuario')

		await deleteUserService(id)
		res.json({ message: 'Usuario eliminado' })
	} catch (error: any) {
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else res.status(400).json({ message: error.message })
	}
}
