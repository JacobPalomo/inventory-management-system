import { Prisma } from '@prisma/client'

const safeUserSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
	shiftId: true,
	createdAt: true,
	createdById: true,
} satisfies Prisma.UserSelect

const cashRegisterSelect = {
	id: true,
	name: true,
	description: true,
	isActive: true,
	createdAt: true,
} satisfies Prisma.CashRegisterSelect

export const cashSessionSelect = {
	id: true,
	registerId: true,
	register: {
		select: cashRegisterSelect,
	},
	userId: true,
	user: {
		select: safeUserSelect,
	},
	openingAmount: true,
	expectedAmount: true,
	countedAmount: true,
	difference: true,
	status: true,
	openedAt: true,
	closedAt: true,
	closedById: true,
	closedBy: {
		select: safeUserSelect,
	},
} satisfies Prisma.CashSessionSelect

export type TCashSession = Prisma.CashSessionGetPayload<{
	select: typeof cashSessionSelect
}>
