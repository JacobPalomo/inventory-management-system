import { NextFunction, Request, Response } from 'express'
import { loginService } from './auth.service'

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = req.body

		const result = await loginService(email, password)

		res.json(result)
	} catch (error) {
		console.log(error)
		next(error)
	}
}
