import { prisma } from '../../config/prisma'

export const findUserByEmail = async (email: string) => {
	return prisma.user.findUnique({
		where: { email },
	})
}

export const createUser = async (data: {
	name: string
	email: string
	password: string
	role?: any
}) => {
	return prisma.user.create({
		data,
	})
}
