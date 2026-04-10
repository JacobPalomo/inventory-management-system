import {
	MovementType,
	PaymentMethod,
	Prisma,
	SaleItemStatus,
	SaleStatus,
} from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PaginationResponse } from '../../shared/types/pagination'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { AppError } from '../../shared/utils/AppError'
import { findActiveCashSessionByUserIdRepo } from '../cash-sessions/cash-session.repository'
import { applyMovementInTransaction } from '../movements/movement.helpers'
import { TSaleDetail } from '../sales/sale.types'
import { roundMoney, withSalePaymentAmounts } from '../sales/sale.utils'
import { TCreateRefund, TRefundsQuery } from './refund.schema'
import {
	createRefundRepo,
	getRefundByIdInTransactionRepo,
	findRefundsRepo,
	getRefundByIdRepo,
	getSalePaidAmountByMethodRepo,
	getSaleForRefundRepo,
	getSalePaidAmountRepo,
	getSaleRefundedAmountByMethodRepo,
	getSaleRefundedAmountRepo,
	updateSaleItemStatusRepo,
	updateSaleStatusAfterRefundRepo,
} from './refund.repository'
import { TRefund } from './refund.types'
import { resolveRefundItems, sumResolvedRefundAmount } from './refund.utils'

export type TCreateRefundResult = {
	refund: TRefund
	sale: TSaleDetail
}

const isSaleRefundable = (sale: {
	status: SaleStatus
	isVoided: boolean
	cancelledAt: Date | null
}) =>
	!sale.isVoided &&
	!sale.cancelledAt &&
	(sale.status === SaleStatus.PAID || sale.status === SaleStatus.REFUNDED)

export const createRefundService = async (
	userId: string,
	data: TCreateRefund,
): Promise<TCreateRefundResult> => {
	const activeCashSession =
		data.method === PaymentMethod.CASH
			? await findActiveCashSessionByUserIdRepo(userId)
			: null

	if (data.method === PaymentMethod.CASH && !activeCashSession) {
		throw new AppError('REFUND_CASH_SESSION_REQUIRED')
	}

	return prisma.$transaction(async tx => {
		const sale = await getSaleForRefundRepo(tx, data.saleId)

		if (!sale) {
			throw new AppError('SALE_NOT_FOUND')
		}

		if (!isSaleRefundable(sale)) {
			throw new AppError('REFUND_SALE_NOT_REFUNDABLE')
		}

		const resolvedRefundItems = resolveRefundItems({
			saleItems: sale.items,
			requestedItems: data.items,
		})

		const [paidAmount, refundedAmount] = await Promise.all([
			getSalePaidAmountRepo(tx, sale.id),
			getSaleRefundedAmountRepo(tx, sale.id),
		])
		const [paidAmountByMethod, refundedAmountByMethod] = await Promise.all([
			getSalePaidAmountByMethodRepo(tx, sale.id, data.method),
			getSaleRefundedAmountByMethodRepo(tx, sale.id, data.method),
		])
		const normalizedPaidAmount = roundMoney(paidAmount)
		const normalizedRefundedAmount = roundMoney(refundedAmount)
		const normalizedPaidAmountByMethod = roundMoney(paidAmountByMethod)
		const normalizedRefundedAmountByMethod = roundMoney(refundedAmountByMethod)
		const refundableAmount = roundMoney(
			Math.max(normalizedPaidAmount - normalizedRefundedAmount, 0),
		)
		const refundableAmountByMethod = roundMoney(
			Math.max(
				normalizedPaidAmountByMethod - normalizedRefundedAmountByMethod,
				0,
			),
		)
		const normalizedAmount = sumResolvedRefundAmount(resolvedRefundItems)

		if (normalizedPaidAmount <= 0 || refundableAmount <= 0) {
			throw new AppError('REFUND_SALE_NOT_REFUNDABLE')
		}

		if (normalizedAmount > refundableAmount) {
			throw new AppError('REFUND_EXCEEDS_REFUNDABLE_BALANCE')
		}

		if (normalizedAmount > refundableAmountByMethod) {
			throw new AppError('REFUND_EXCEEDS_METHOD_BALANCE')
		}

		const sessionId = activeCashSession?.id ?? null

		const refund = await createRefundRepo(tx, {
			saleId: sale.id,
			userId,
			sessionId,
			method: data.method,
			amount: normalizedAmount,
			reference: data.reference?.trim() || null,
			reason: data.reason?.trim() || null,
			items: resolvedRefundItems.map(item => ({
				saleItemId: item.saleItemId,
				quantity: item.quantity,
				subtotal: item.subtotal,
				discount: item.discount,
				tax: item.tax,
				total: item.total,
			})),
		})

		for (const item of resolvedRefundItems) {
			if (item.trackStock) {
				await applyMovementInTransaction({
					tx,
					userId,
					productId: item.productId,
					type: MovementType.IN,
					quantity: item.quantity,
					reason: `Devolucion ${refund.id} - ${item.productName}`,
				})
			}

			if (item.shouldMarkAsRefunded) {
				await updateSaleItemStatusRepo(
					tx,
					item.saleItemId,
					SaleItemStatus.REFUNDED,
				)
			}
		}

		const totalRefunded = roundMoney(normalizedRefundedAmount + refund.amount)
		const nextStatus =
			totalRefunded >= roundMoney(sale.total)
				? SaleStatus.REFUNDED
				: sale.status

		const updatedSale = await updateSaleStatusAfterRefundRepo(
			tx,
			sale.id,
			nextStatus,
		)
		const refreshedRefund = await getRefundByIdInTransactionRepo(tx, refund.id)

		if (!refreshedRefund) {
			throw new AppError('REFUND_NOT_FOUND')
		}

		return {
			refund: refreshedRefund,
			sale: withSalePaymentAmounts(
				updatedSale,
				normalizedPaidAmount,
				totalRefunded,
			),
		}
	})
}

export const getRefundsService = async (
	query: TRefundsQuery,
): Promise<PaginationResponse<TRefund>> => {
	const {
		page,
		limit,
		saleId,
		sessionId,
		userId,
		method,
		dateFrom,
		dateTo,
		sortBy,
		sortOrder,
	} = query

	const skip = (page - 1) * limit

	const where: Prisma.RefundWhereInput = {
		AND: [
			saleId ? { saleId } : {},
			sessionId ? { sessionId } : {},
			userId ? { userId } : {},
			method ? { method } : {},
			dateFrom || dateTo
				? {
						createdAt: {
							...(dateFrom ? { gte: formatFromDate(dateFrom) } : {}),
							...(dateTo ? { lte: formatToDate(dateTo) } : {}),
						},
					}
				: {},
		],
	}

	const { data, total } = await findRefundsRepo({
		skip,
		take: limit,
		where,
		orderBy: {
			[sortBy]: sortOrder,
		},
	})

	return {
		data,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	}
}

export const getRefundByIdService = async (id: string): Promise<TRefund> => {
	const refund = await getRefundByIdRepo(id)

	if (!refund) {
		throw new AppError('REFUND_NOT_FOUND')
	}

	return refund
}
