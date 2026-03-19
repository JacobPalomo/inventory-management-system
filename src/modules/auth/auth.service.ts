import jwt from 'jsonwebtoken'
import { findUserByEmail, createUser } from './auth.repository'
import { hashPassword, comparePassword } from '../../utils/hash'
import { AppError } from '../../utils/AppError'
import { env } from '../../config/env'

export const registerService = async (data: {
	name: string
	email: string
	password: string
}) => {
	const existingUser = await findUserByEmail(data.email)

	if (existingUser) {
		throw new AppError('User already exists', 409)
	}

	const hashedPassword = await hashPassword(data.password)

	const user = await createUser({
		...data,
		password: hashedPassword,
	})

	return user
}

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
