import { Role } from '@prisma/client'
import { prisma } from '../../config/prisma'

export const findUserByEmail = async (email: string) => {
	return prisma.user.findUnique({
		where: { email },
	})
}

export const findAllEmployeesRepo = async () => {
	return await prisma.user.findMany({
		where: {
			shiftId: { not: null },
			role: { not: Role.ADMIN },
		},
		select: {
			email: true,
			name: true,
			shift: {
				select: {
					startTime: true,
					endTime: true,
				},
			},
		},
	})
}
