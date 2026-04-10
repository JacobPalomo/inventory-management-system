import { Prisma } from '@prisma/client'

const safeUserSelect = {
	id: true,
	name: true,
} satisfies Prisma.UserSelect

const refundSaleSummarySelect = {
	id: true,
	sessionId: true,
	status: true,
	total: true,
} satisfies Prisma.SaleSelect

const refundCashSessionSummarySelect = {
	id: true,
	registerId: true,
	status: true,
	openedAt: true,
} satisfies Prisma.CashSessionSelect

const safeProductSelect = {
	id: true,
	name: true,
	barcode: true,
	sku: true,
} satisfies Prisma.ProductSelect

const refundItemSaleItemSummarySelect = {
	id: true,
	saleId: true,
	productId: true,
	product: {
		select: safeProductSelect,
	},
	quantity: true,
	price: true,
	subtotal: true,
	discount: true,
	tax: true,
	total: true,
	status: true,
} satisfies Prisma.SaleItemSelect

export const refundItemSelect = {
	id: true,
	refundId: true,
	saleItemId: true,
	saleItem: {
		select: refundItemSaleItemSummarySelect,
	},
	quantity: true,
	subtotal: true,
	discount: true,
	tax: true,
	total: true,
	createdAt: true,
} satisfies Prisma.RefundItemSelect

export const refundEmbeddedSelect = {
	id: true,
	saleId: true,
	userId: true,
	sessionId: true,
	session: {
		select: refundCashSessionSummarySelect,
	},
	user: {
		select: safeUserSelect,
	},
	method: true,
	amount: true,
	reference: true,
	reason: true,
	createdAt: true,
	items: {
		select: refundItemSelect,
	},
} satisfies Prisma.RefundSelect

export const refundSelect = {
	...refundEmbeddedSelect,
	sale: {
		select: refundSaleSummarySelect,
	},
} satisfies Prisma.RefundSelect

export type TRefund = Prisma.RefundGetPayload<{
	select: typeof refundSelect
}>

export type TRefundItem = Prisma.RefundItemGetPayload<{
	select: typeof refundItemSelect
}>
