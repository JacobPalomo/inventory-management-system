import { Prisma, SaleStatus } from '@prisma/client'
import { AppError } from '../../shared/utils/AppError'
import { TSalesQuery } from './sale.schema'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { saleDetailSelect, saleSelect, TSaleComputedAmounts } from './sale.types'

export const buildSalesWhere = (query: TSalesQuery): Prisma.SaleWhereInput => {
	const {
		status,
		userId,
		sessionId,
		customerId,
		isVoided,
		isCancelled,
		sessionOpen,
		dateFrom,
		dateTo,
		today,
		minTotal,
		maxTotal,
		productId,
		itemStatus,
		itemVoided,
	} = query

	const where: Prisma.SaleWhereInput = {}

	if (status) where.status = status
	if (userId) where.userId = userId
	if (sessionId) where.sessionId = sessionId
	if (customerId) where.customerId = customerId

	if (typeof isVoided === 'boolean') {
		where.isVoided = isVoided
	}

	if (typeof isCancelled === 'boolean') {
		where.cancelledAt = isCancelled ? { not: null } : null
	}

	if (typeof sessionOpen === 'boolean' && !sessionId) {
		where.sessionId = sessionOpen ? { not: null } : null
	}

	if (today) {
		const start = new Date()
		start.setHours(0, 0, 0, 0)

		const end = new Date()
		end.setHours(23, 59, 59, 999)

		where.createdAt = {
			gte: formatFromDate(start),
			lte: formatToDate(end),
		}
	}

	if ((!today && dateFrom) || dateTo) {
		where.createdAt = {
			...(dateFrom && { gte: formatFromDate(dateFrom) }),
			...(dateTo && { lte: formatToDate(dateTo) }),
		}
	}

	if (minTotal !== undefined || maxTotal !== undefined) {
		where.total = {
			...(minTotal !== undefined && { gte: minTotal }),
			...(maxTotal !== undefined && { lte: maxTotal }),
		}
	}

	if (productId || itemStatus || typeof itemVoided === 'boolean') {
		where.items = {
			some: {
				...(productId && { productId }),
				...(itemStatus && { status: itemStatus }),
				...(typeof itemVoided === 'boolean' && { isVoided: itemVoided }),
			},
		}
	}

	return where
}

export const buildSalesSelect = (withItems?: boolean) =>
	withItems ? saleDetailSelect : saleSelect

export const roundMoney = (value: number): number =>
	Math.round((value + Number.EPSILON) * 100) / 100

export const calculateSaleItemAmounts = (params: {
	quantity: number
	price: number
	discount: number
	taxRate: number
}) => {
	const { quantity, price, discount, taxRate } = params

	const subtotal = roundMoney(quantity * price)
	const normalizedDiscount = roundMoney(discount)

	if (normalizedDiscount > subtotal) {
		throw new AppError('SALE_INVALID_ITEM_DISCOUNT')
	}

	const taxableAmount = roundMoney(subtotal - normalizedDiscount)
	const tax = roundMoney(taxableAmount * taxRate)
	const total = roundMoney(taxableAmount + tax)

	return {
		subtotal,
		discount: normalizedDiscount,
		tax,
		total,
	}
}

export const normalizeSaleTotals = (totals: {
	subtotal?: number | null
	discount?: number | null
	tax?: number | null
	total?: number | null
}) => ({
	subtotal: roundMoney(totals.subtotal ?? 0),
	discount: roundMoney(totals.discount ?? 0),
	tax: roundMoney(totals.tax ?? 0),
	total: roundMoney(totals.total ?? 0),
})

export const calculateSalePaymentAmounts = (
	total: number,
	paidAmount: number,
	refundedAmount = 0,
): TSaleComputedAmounts => {
	const normalizedTotal = roundMoney(total)
	const normalizedPaidAmount = roundMoney(paidAmount)
	const normalizedRefundedAmount = roundMoney(refundedAmount)
	const remainingAmount = roundMoney(
		Math.max(normalizedTotal - normalizedPaidAmount, 0),
	)
	const refundableAmount = roundMoney(
		Math.max(
			Math.min(normalizedPaidAmount, normalizedTotal) - normalizedRefundedAmount,
			0,
		),
	)

	return {
		paidAmount: normalizedPaidAmount,
		remainingAmount,
		refundedAmount: normalizedRefundedAmount,
		refundableAmount,
	}
}

export const withSalePaymentAmounts = <
	TSaleLike extends {
		total: number
	},
>(
	sale: TSaleLike,
	paidAmount: number,
	refundedAmount = 0,
): TSaleLike & TSaleComputedAmounts => ({
	...sale,
	...calculateSalePaymentAmounts(sale.total, paidAmount, refundedAmount),
})

export const isSaleEditable = (sale: {
	status: SaleStatus
	isVoided: boolean
	cancelledAt: Date | null
}) =>
	!sale.isVoided &&
	!sale.cancelledAt &&
	(sale.status === SaleStatus.OPEN ||
		sale.status === SaleStatus.HOLD ||
		sale.status === SaleStatus.QUOTE)
