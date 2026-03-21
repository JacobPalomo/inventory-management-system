import { Role } from '@prisma/client'
import z from 'zod'
import { PaginationQuery } from '../../types/pagination'

export interface UserQuery extends PaginationQuery {
	search?: string
}

export interface UserResponse {
	id: string
	email: string
	name: string
	role: Role
	shiftId: string | null
	createdAt: Date
	createdById: string | null
	shift: {
		id: string
		name: string
		createdAt: Date
		startTime: number
		endTime: number
		isActive: boolean
	} | null
	createdBy: {
		id: string
		email: string
		name: string
		role: Role
	} | null
	usersCreated: {
		id: string
		email: string
		name: string
		role: Role
	}[]
}

export interface SafeUserResponse {
	id: string
	name: string
	email: string
	role: Role
	shiftId: string | null
	createdAt: Date
	createdById: string | null
}

export interface TZodCreateUser {
	name: z.ZodString
	email: z.ZodEmail
	password: z.ZodString
	role: z.ZodEnum<typeof Role>
	shiftId?: z.ZodOptional<z.ZodString>
	createdById: z.ZodString
}

export interface TCreateUser {
	name: string
	email: string
	password: string
	role: Role
	shiftId?: string
	createdById: string
}

export interface TZodUpdateUser {
	name?: z.ZodOptional<z.ZodString>
	email?: z.ZodOptional<z.ZodEmail>
	role?: z.ZodOptional<z.ZodEnum<typeof Role>>
	shiftId?: z.ZodOptional<z.ZodString>
}

export interface TUpdateUser {
	name?: string
	email?: string
	role?: Role
	shiftId?: string
}

export interface TZodUpdatePassword {
	currentPassword: z.ZodString
	newPassword: z.ZodString
}

export interface TUpdatePassword {
	currentPassword: string
	newPassword: string
}

export interface TZodAdminUpdatePassword {
	newPassword: z.ZodString
}

export interface TAdminUpdatePassword {
	newPassword: string
}
