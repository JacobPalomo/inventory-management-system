import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../shared/utils/AppError'

export interface AuthRequest extends Request {
	user?: any
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		throw new AppError('UNAUTHORIZED')
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET)
		req.user = decoded
		next()
	} catch {
		throw new AppError('UNAUTHORIZED')
	}
}
