import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import { AppError } from '../utils/AppError'

export const authorizeRoles =
	(...roles: string[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			throw new AppError('FORBIDDEN')
		}

		next()
	}
