import { Prisma } from '@prisma/client'

const safeUserSelect = {
	id: true,
	name: true,
} satisfies Prisma.UserSelect

const safeProductSelect = {
	id: true,
	name: true,
	barcode: true,
	sku: true,
} satisfies Prisma.ProductSelect

export const saleItemSelect = {
	id: true,
	productId: true,
	product: {
		select: safeProductSelect,
	},
	quantity: true,
	price: true,
	cost: true,
	discount: true,
	subtotal: true,
	tax: true,
	total: true,
	status: true,
	isVoided: true,
	voidedAt: true,
	voidedById: true,
	cancelledAt: true,
	cancelledById: true,
	cancelReason: true,
} satisfies Prisma.SaleItemSelect

export const saleSelect = {
	id: true,
	sessionId: true,
	userId: true,
	user: {
		select: safeUserSelect,
	},
	customerId: true,

	status: true,
	subtotal: true,
	tax: true,
	discount: true,
	total: true,

	notes: true,

	isVoided: true,
	voidedAt: true,
	voidedById: true,
	voidedBy: {
		select: safeUserSelect,
	},

	createdAt: true,
	updatedAt: true,

	cancelledAt: true,
	cancelledById: true,
	cancelledBy: {
		select: safeUserSelect,
	},
} satisfies Prisma.SaleSelect

export const saleDetailSelect = {
	...saleSelect,
	items: {
		select: saleItemSelect,
	},
} satisfies Prisma.SaleSelect

export type TSale = Prisma.SaleGetPayload<{
	select: typeof saleSelect
}>

export type TSaleDetail = Prisma.SaleGetPayload<{
	select: typeof saleDetailSelect
}>

export type TSaleList = TSale | TSaleDetail
