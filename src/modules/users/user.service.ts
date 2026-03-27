import { Prisma } from '@prisma/client'
import { AppError } from '../../shared/utils/AppError'
import { comparePassword, hashPassword } from '../../shared/utils/hash'
import { PaginationResponse } from '../../shared/types/pagination'
import {
	SafeUserResponse,
	TAdminUpdatePassword,
	TCreateUser,
	TUpdatePassword,
	TUpdateUser,
	UserResponse,
} from './user.types'
import {
	createUserRepo,
	findUserByEmailRepo,
	findUserByIdRepo,
	updateUserRepo,
	getUsersRepo,
	deleteUserRepo,
	updatePasswordRepo,
} from './user.repository'
import { TUsersQuery } from './user.schema'

export const getUsersService = async (
	query: TUsersQuery,
): Promise<PaginationResponse<UserResponse>> => {
	const { page, limit, search } = query

	const skip = (page - 1) * limit

	const where: Prisma.UserWhereInput = {
		name: {
			contains: search,
			mode: 'insensitive',
		},
	}

	const { data, total } = await getUsersRepo({
		skip,
		take: limit,
		where,
	})

	return {
		data,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const createUserService = async (
	data: TCreateUser,
): Promise<SafeUserResponse> => {
	// Validar que no exista un usuario con ese mismo correo
	const existingUser = await findUserByEmailRepo(data.email)
	if (existingUser) throw new AppError('USER_ALREADY_EXISTS')

	// Cifrado de contraseña
	const hashedPassword = await hashPassword(data.password)

	const user = await createUserRepo({
		...data,
		password: hashedPassword,
	})

	// Omitimos la contraseña en la respuesta
	const { password: _, ...safeUser } = user
	return safeUser
}

export const updateUserService = async (
	id: string,
	data: TUpdateUser,
): Promise<SafeUserResponse> => {
	// Validamos que el usuario exista
	const user = await findUserByIdRepo(id)
	if (!user) throw new AppError('USER_ALREADY_EXISTS')

	// Si se está modificando el correo verificamos que no exista un usuario con ese correo
	if (data.email) {
		const existsUser = await findUserByEmailRepo(data.email)
		if (existsUser) throw new AppError('USER_ALREADY_EXISTS')
	}

	const updatedUser = await updateUserRepo(id, data)

	// Omitimos la contraseña en la respuesta
	const { password: _, ...safeUser } = updatedUser
	return safeUser
}

export const updatePasswordService = async (
	id: string,
	data: TUpdatePassword,
) => {
	// Validamos que el usuario exista
	const user = await findUserByIdRepo(id)
	if (!user) throw new AppError('USER_NOT_FOUND')

	// Validamos que la contraseña actual se correcta
	const isMatch = await comparePassword(data.currentPassword, user.password)
	if (!isMatch) throw new AppError('USER_INVALID_CURRENT_PASSWORD')

	// Validamos que la nueva contraseña no sea la misma que la actual
	if (data.newPassword === data.currentPassword)
		throw new AppError('USER_SAME_PASSWORD')

	// Ciframos la nueva contraseña
	const hashedPassword = await hashPassword(data.newPassword)

	// Guardamos la nueva contraseña
	await updatePasswordRepo(id, hashedPassword)

	return { message: 'Contraseña actualizada correctamente' }
}

export const adminUpdatePasswordService = async (
	id: string,
	data: TAdminUpdatePassword,
) => {
	// Validamos que el usuario exista
	const user = await findUserByIdRepo(id)
	if (!user) throw new AppError('USER_NOT_FOUND')

	// Ciframos la nueva contraseña
	const hashedPassword = await hashPassword(data.newPassword)

	// Guardamos la nueva contraseña
	await updatePasswordRepo(id, hashedPassword)

	return {
		message: 'Contraseña actualizada correctamente por el administrador',
	}
}

export const deleteUserService = async (id: string) => {
	// Validamos que el usuario exista
	const user = await findUserByIdRepo(id)
	if (!user) throw new AppError('USER_NOT_FOUND')

	await deleteUserRepo(id)

	return {
		message: 'Usuario eliminado correctamente',
	}
}
