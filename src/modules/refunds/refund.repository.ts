import { PaymentMethod, Prisma, SaleItemStatus, SaleStatus } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { saleDetailSelect, TSaleDetailRaw } from '../sales/sale.types'
import { refundSelect, TRefund } from './refund.types'

export const findRefundsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.RefundWhereInput
	orderBy: Prisma.RefundOrderByWithRelationInput
}): Promise<{ data: TRefund[]; total: number }> => {
	const { skip, take, where, orderBy } = params

	const [data, total] = await Promise.all([
		prisma.refund.findMany({
			where,
			select: refundSelect,
			skip,
			take,
			orderBy,
		}),
		prisma.refund.count({ where }),
	])

	return { data, total }
}

export const getRefundByIdRepo = async (
	id: string,
): Promise<TRefund | null> => {
	return prisma.refund.findUnique({
		where: { id },
		select: refundSelect,
	})
}

export const getRefundByIdInTransactionRepo = async (
	tx: Prisma.TransactionClient,
	id: string,
): Promise<TRefund | null> => {
	return tx.refund.findUnique({
		where: { id },
		select: refundSelect,
	})
}

export const getSaleForRefundRepo = async (
	tx: Prisma.TransactionClient,
	id: string,
) => {
	return tx.sale.findUnique({
		where: { id },
		select: {
			id: true,
			status: true,
			total: true,
			isVoided: true,
			cancelledAt: true,
			items: {
				select: {
					id: true,
					productId: true,
					quantity: true,
					subtotal: true,
					discount: true,
					tax: true,
					total: true,
					status: true,
					isVoided: true,
					cancelledAt: true,
					product: {
						select: {
							id: true,
							name: true,
							trackStock: true,
							isActive: true,
						},
					},
					refundItems: {
						select: {
							quantity: true,
							subtotal: true,
							discount: true,
							tax: true,
							total: true,
						},
					},
				},
			},
		},
	})
}

export const getSalePaidAmountRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
) => {
	const totals = await tx.payment.aggregate({
		where: { saleId },
		_sum: {
			amount: true,
		},
	})

	return totals._sum.amount ?? 0
}

export const getSalePaidAmountByMethodRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
	method: PaymentMethod,
) => {
	const totals = await tx.payment.aggregate({
		where: {
			saleId,
			method,
		},
		_sum: {
			amount: true,
		},
	})

	return totals._sum.amount ?? 0
}

export const getSaleRefundedAmountRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
) => {
	const totals = await tx.refund.aggregate({
		where: { saleId },
		_sum: {
			amount: true,
		},
	})

	return totals._sum.amount ?? 0
}

export const getSaleRefundedAmountByMethodRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
	method: PaymentMethod,
) => {
	const totals = await tx.refund.aggregate({
		where: {
			saleId,
			method,
		},
		_sum: {
			amount: true,
		},
	})

	return totals._sum.amount ?? 0
}

export const createRefundRepo = async (
	tx: Prisma.TransactionClient,
	data: {
		saleId: string
		userId: string
		sessionId?: string | null
		method: PaymentMethod
		amount: number
		reference?: string | null
		reason?: string | null
		items: Array<{
			saleItemId: string
			quantity: number
			subtotal: number
			discount: number
			tax: number
			total: number
		}>
	},
): Promise<TRefund> => {
	const { saleId, userId, sessionId, items, ...refundData } = data

	return tx.refund.create({
		data: {
			...refundData,
			sale: {
				connect: { id: saleId },
			},
			user: {
				connect: { id: userId },
			},
			...(sessionId
				? {
						session: {
							connect: { id: sessionId },
						},
					}
				: {}),
			items: {
				create: items.map(item => ({
					saleItem: {
						connect: { id: item.saleItemId },
					},
					quantity: item.quantity,
					subtotal: item.subtotal,
					discount: item.discount,
					tax: item.tax,
					total: item.total,
				})),
			},
		},
		select: refundSelect,
	})
}

export const updateSaleItemStatusRepo = async (
	tx: Prisma.TransactionClient,
	saleItemId: string,
	status: SaleItemStatus,
) => {
	return tx.saleItem.update({
		where: { id: saleItemId },
		data: { status },
		select: {
			id: true,
			status: true,
		},
	})
}

export const updateSaleStatusAfterRefundRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
	status: SaleStatus,
): Promise<TSaleDetailRaw> => {
	return tx.sale.update({
		where: { id: saleId },
		data: { status },
		select: saleDetailSelect,
	})
}
