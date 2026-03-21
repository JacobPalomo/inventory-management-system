import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { TCreateUser, TUpdateUser } from './user.types'

export const findUserByIdRepo = async (id: string) => {
	return await prisma.user.findUnique({ where: { id } })
}

export const findUserByEmailRepo = async (email: string) => {
	return await prisma.user.findUnique({ where: { email } })
}

export const getUsersRepo = async (params: {
	skip: number
	take: number
	where: Prisma.UserWhereInput
}) => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.user.findMany({
			where,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				shiftId: true,
				shift: true,
				createdAt: true,
				createdById: true,
				createdBy: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
				usersCreated: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.user.count(),
	])

	return { data, total }
}

export const createUserRepo = async (data: TCreateUser) => {
	return await prisma.user.create({ data })
}

export const updateUserRepo = async (id: string, data: TUpdateUser) => {
	return await prisma.user.update({ where: { id }, data })
}

export const updatePasswordRepo = async (
	id: string,
	newHashedPassword: string,
) => {
	return await prisma.user.update({
		where: { id },
		data: { password: newHashedPassword },
	})
}

export const deleteUserRepo = async (id: string) => {
	return await prisma.product.delete({
		where: { id },
	})
}
