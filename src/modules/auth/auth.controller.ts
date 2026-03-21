import { Request, Response } from 'express'
import { loginService } from './auth.service'

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		const result = await loginService(email, password)

		res.json(result)
	} catch (error: any) {
		console.log(error)
		if (error.name === 'ZodError')
			res.status(400).json({ message: JSON.parse(error.message)[0].message })
		else if (error.statusCode)
			res.status(error.statusCode).json({ message: error.message })
		else res.status(500).json(error)
	}
}
