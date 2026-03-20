import { z } from 'zod'
import {
	TZodAdminUpdatePassword,
	TZodCreateUser,
	TZodUpdatePassword,
	TZodUpdateUser,
} from './user.types'
import { Role } from '@prisma/client'

export const createUserSchema = z.object<TZodCreateUser>({
	name: z.string().min(3, 'El nombre debe contener al menos 3 caracteres'),
	email: z.email('El correo no es válido'),
	password: z
		.string()
		.min(6, 'La contraseña debe contener al menos 6 caracteres'),
	role: z.enum(Role, 'Rol inválido'),
	shiftId: z.string().optional(),
	createdById: z.string(),
})

export const updateUserSchema = z.object<TZodUpdateUser>({
	name: z
		.string()
		.min(3, 'El nombre debe contener al menos 3 caracteres')
		.optional(),
	email: z.email('El correo no es válido').optional(),
	role: z.enum(Role, 'Rol inválido').optional(),
	shiftId: z.string().optional(),
})

export const updatePasswordSchema = z.object<TZodUpdatePassword>({
	currentPassword: z
		.string()
		.min(6, 'La contraseña debe contener al menos 6 caracteres'),
	newPassword: z
		.string()
		.min(6, 'La contraseña debe contener al menos 6 caracteres'),
})

export const adminUpdatePasswordSchema = z.object<TZodAdminUpdatePassword>({
	newPassword: z
		.string()
		.min(6, 'La contraseña debe contener al menos 6 caracteres'),
})
