import { CashSessionStatus, Prisma, SaleStatus } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PaginationResponse } from '../../shared/types/pagination'
import { formatFromDate, formatToDate } from '../../shared/utils/formatDate'
import { AppError } from '../../shared/utils/AppError'
import { roundMoney } from '../sales/sale.utils'
import { TSaleDetail } from '../sales/sale.types'
import { withSalePaymentAmounts } from '../sales/sale.utils'
import { TCreatePayment, TPaymentsQuery } from './payment.schema'
import {
	createPaymentRepo,
	findPaymentsRepo,
	getCashSessionStatusForPaymentRepo,
	getPaymentByIdRepo,
	getSaleForPaymentRepo,
	getSalePaidAmountRepo,
	updateSaleStatusAfterPaymentRepo,
} from './payment.repository'
import { TPayment } from './payment.types'

export type TCreatePaymentResult = {
	payment: TPayment
	sale: TSaleDetail
}

const isSalePayable = (sale: {
	status: SaleStatus
	isVoided: boolean
	cancelledAt: Date | null
}) =>
	!sale.isVoided &&
	!sale.cancelledAt &&
	sale.status !== SaleStatus.CANCELLED &&
	sale.status !== SaleStatus.REFUNDED

export const createPaymentService = async (
	userId: string,
	data: TCreatePayment,
): Promise<TCreatePaymentResult> => {
	return prisma.$transaction(async tx => {
		const sale = await getSaleForPaymentRepo(tx, data.saleId)

		if (!sale) {
			throw new AppError('SALE_NOT_FOUND')
		}

		if (!isSalePayable(sale) || roundMoney(sale.total) <= 0) {
			throw new AppError('PAYMENT_SALE_NOT_PAYABLE')
		}

		if (sale.sessionId) {
			const cashSession = await getCashSessionStatusForPaymentRepo(
				tx,
				sale.sessionId,
			)

			if (!cashSession) {
				throw new AppError('CASH_SESSION_NOT_FOUND')
			}

			if (cashSession.status !== CashSessionStatus.OPEN) {
				throw new AppError('CASH_SESSION_ALREADY_CLOSED')
			}
		}

		const currentPaidAmount = roundMoney(
			await getSalePaidAmountRepo(tx, sale.id),
		)
		const remainingAmount = roundMoney(sale.total - currentPaidAmount)
		const normalizedAmount = roundMoney(data.amount)

		if (remainingAmount <= 0) {
			throw new AppError('PAYMENT_SALE_NOT_PAYABLE')
		}

		if (normalizedAmount > remainingAmount) {
			throw new AppError('PAYMENT_EXCEEDS_REMAINING_BALANCE')
		}

		const payment = await createPaymentRepo(tx, {
			saleId: sale.id,
			userId,
			method: data.method,
			amount: normalizedAmount,
			reference: data.reference?.trim() || null,
		})

		const totalPaid = roundMoney(currentPaidAmount + payment.amount)
		const nextStatus =
			totalPaid >= roundMoney(sale.total) ? SaleStatus.PAID : sale.status

		const updatedSale = await updateSaleStatusAfterPaymentRepo(
			tx,
			sale.id,
			nextStatus,
		)
		const refundedAmount = updatedSale.refunds.reduce(
			(total, refund) => total + refund.amount,
			0,
		)

		return {
			payment,
			sale: withSalePaymentAmounts(updatedSale, totalPaid, refundedAmount),
		}
	})
}

export const getPaymentsService = async (
	query: TPaymentsQuery,
): Promise<PaginationResponse<TPayment>> => {
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

	const where: Prisma.PaymentWhereInput = {
		AND: [
			saleId ? { saleId } : {},
			sessionId
				? {
						sale: {
							sessionId,
						},
					}
				: {},
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

	const { data, total } = await findPaymentsRepo({
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

export const getPaymentByIdService = async (id: string): Promise<TPayment> => {
	const payment = await getPaymentByIdRepo(id)

	if (!payment) {
		throw new AppError('PAYMENT_NOT_FOUND')
	}

	return payment
}
