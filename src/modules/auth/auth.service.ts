import jwt from 'jsonwebtoken'
import { findAllEmployeesRepo, findUserByEmail } from './auth.repository'
import { comparePassword } from '../../shared/utils/hash'
import { AppError } from '../../shared/utils/AppError'
import { env } from '../../config/env'
import { formatLoginUser } from './auth.utils'
import { LoginUser } from './auth.types'

export const loginService = async (email: string, password: string) => {
	const user = await findUserByEmail(email)

	if (!user) {
		throw new AppError('INVALID_CREDENTIALS')
	}

	const isValid = await comparePassword(password, user.password)

	if (!isValid) {
		throw new AppError('INVALID_CREDENTIALS')
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

export const getLoginUsersService = async () => {
	const users: LoginUser[] = (await findAllEmployeesRepo()) as LoginUser[]
	const formattedUsers = users.map(user => formatLoginUser(user))

	return formattedUsers
}
