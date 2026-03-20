import jwt from 'jsonwebtoken'
import { findUserByEmail } from './auth.repository'
import { comparePassword } from '../../utils/hash'
import { AppError } from '../../utils/AppError'
import { env } from '../../config/env'

export const loginService = async (email: string, password: string) => {
	const user = await findUserByEmail(email)

	if (!user) {
		throw new AppError('Invalid credentials', 401)
	}

	const isValid = await comparePassword(password, user.password)

	if (!isValid) {
		throw new AppError('Invalid credentials', 401)
	}

	const token = jwt.sign(
		{
			id: user.id,
			role: user.role,
		},
		env.JWT_SECRET,
		{ expiresIn: '1d' },
	)

	const { password: _, ...safeUser } = user
	return {
		token,
		user: safeUser,
	}
}
