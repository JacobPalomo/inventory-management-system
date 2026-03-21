import { Prisma } from '@prisma/client'
import { AppError } from '../../utils/AppError'
import { comparePassword, hashPassword } from '../../utils/hash'
import { PaginatedResponse } from '../../types/pagination'
import {
	SafeUserResponse,
	TAdminUpdatePassword,
	TCreateUser,
	TUpdatePassword,
	TUpdateUser,
	UserQuery,
	UserResponse,
} from './user.types'
import {
	createUserRepo,
	findUserByEmailRepo,
	findAdminByIdRepo,
	findUserByIdRepo,
	updateUserRepo,
	getUsersRepo,
	deleteUserRepo,
	updatePasswordRepo,
} from './user.repository'

export const getUsersService = async (
	query: UserQuery,
): Promise<PaginatedResponse<UserResponse>> => {
	const page = parseInt(query.page) || 1
	const limit = parseInt(query.limit) || 10
	const skip = (page - 1) * limit

	const search = query.search || ''
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
	// Validar que la información venga con el ID del usuario administrador
	if (!data.createdById)
		throw new AppError('No se obtuvo el id del usuario administrador', 400)

	// Validar usuario administrado que está creando al nuevo usuario
	const admin = await findAdminByIdRepo(data.createdById)
	if (!admin) throw new AppError('Usuario administrador inválido', 400)

	// Validar que no exista un usuario con ese mismo correo
	const existingUser = await findUserByEmailRepo(data.email)
	if (existingUser) throw new AppError('Usuario existente', 409)

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
	if (!user) throw new AppError('El usuario no existe', 404)

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
	if (!user) throw new AppError('El usuario no existe', 404)

	// Validamos que la contraseña actual se correcta
	const isMatch = await comparePassword(data.currentPassword, user.password)
	if (!isMatch) throw new AppError('Contraseña actual incorrecta', 400)

	// Validamos que la nueva contraseña no sea la misma que la actual
	if (data.newPassword === data.currentPassword)
		throw new AppError(
			'La nueva contraseña debe ser diferente a la actual',
			400,
		)

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
	if (!user) throw new AppError('El usuario no existe', 404)

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
	if (!user) throw new AppError('El usuario no existe', 404)

	await deleteUserRepo(id)

	return {
		message: 'Usuario eliminado correctamente',
	}
}
