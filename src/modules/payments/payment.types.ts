import { Prisma } from '@prisma/client'

const safeUserSelect = {
	id: true,
	name: true,
} satisfies Prisma.UserSelect

const paymentSaleSummarySelect = {
	id: true,
	sessionId: true,
	status: true,
	total: true,
} satisfies Prisma.SaleSelect

export const paymentEmbeddedSelect = {
	id: true,
	saleId: true,
	userId: true,
	user: {
		select: safeUserSelect,
	},
	method: true,
	amount: true,
	reference: true,
	createdAt: true,
} satisfies Prisma.PaymentSelect

export const paymentSelect = {
	...paymentEmbeddedSelect,
	sale: {
		select: paymentSaleSummarySelect,
	},
} satisfies Prisma.PaymentSelect

export type TPayment = Prisma.PaymentGetPayload<{
	select: typeof paymentSelect
}>
