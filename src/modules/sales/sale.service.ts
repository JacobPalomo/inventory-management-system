import { CashSessionStatus, MovementType } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PaginationResponse } from '../../shared/types/pagination'
import { AppError } from '../../shared/utils/AppError'
import { findCashSessionByIdRepo } from '../cash-sessions/cash-session.repository'
import { applyMovementInTransaction } from '../movements/movement.helpers'
import {
	TAddItemToSale,
	TCreateSale,
	TSalesQuery,
} from './sale.schema'
import {
	createSaleItemRepo,
	createSaleRepo,
	findSalesRepo,
	getProductForSaleRepo,
	getPaidAmountsBySaleIdsRepo,
	getRefundedAmountsBySaleIdsRepo,
	getSaleByIdRepo,
	getSaleEditableStateRepo,
	getSaleTotalsRepo,
	updateSaleTotalsRepo,
} from './sale.repository'
import { TSale, TSaleDetail, TSaleList } from './sale.types'
import {
	buildSalesWhere,
	calculateSaleItemAmounts,
	isSaleEditable,
	withSalePaymentAmounts,
} from './sale.utils'

export const createSaleService = async (
	userId: string,
	data: TCreateSale,
): Promise<TSale> => {
	if (data.sessionId) {
		const cashSession = await findCashSessionByIdRepo(data.sessionId)

		if (!cashSession) {
			throw new AppError('CASH_SESSION_NOT_FOUND')
		}

		if (cashSession.status !== CashSessionStatus.OPEN) {
			throw new AppError('CASH_SESSION_ALREADY_CLOSED')
		}
	}

	const sale = await createSaleRepo(userId, data)

	return withSalePaymentAmounts(sale, 0, 0)
}

export const getSalesService = async (
	query: TSalesQuery,
): Promise<PaginationResponse<TSaleList>> => {
	const skip = (query.page - 1) * query.limit
	const where = buildSalesWhere(query)

	const { data, total } = await findSalesRepo({
		skip,
		take: query.limit,
		where,
		query,
	})
	const saleIds = data.map(sale => sale.id)
	const [paidAmountsBySaleId, refundedAmountsBySaleId] = await Promise.all([
		getPaidAmountsBySaleIdsRepo(saleIds),
		getRefundedAmountsBySaleIdsRepo(saleIds),
	])
	const enrichedData = data.map(sale =>
		withSalePaymentAmounts(
			sale,
			paidAmountsBySaleId.get(sale.id) ?? 0,
			refundedAmountsBySaleId.get(sale.id) ?? 0,
		),
	)

	return {
		data: enrichedData,
		meta: {
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		},
	}
}

export const getSaleByIdService = async (
	id: string,
): Promise<TSaleDetail> => {
	const sale = await getSaleByIdRepo(id)

	if (!sale) {
		throw new AppError('SALE_NOT_FOUND')
	}

	const paidAmount = sale.payments.reduce(
		(total, payment) => total + payment.amount,
		0,
	)
	const refundedAmount = sale.refunds.reduce(
		(total, refund) => total + refund.amount,
		0,
	)

	return withSalePaymentAmounts(sale, paidAmount, refundedAmount)
}

export const addItemToSaleService = async (params: {
	saleId: string
	userId: string
	data: TAddItemToSale
}): Promise<TSaleDetail> => {
	const { saleId, userId, data } = params

	return prisma.$transaction(async tx => {
		const sale = await getSaleEditableStateRepo(tx, saleId)

		if (!sale) {
			throw new AppError('SALE_NOT_FOUND')
		}

		if (!isSaleEditable(sale)) {
			throw new AppError('SALE_NOT_EDITABLE')
		}

		const product = await getProductForSaleRepo(tx, data.productId)

		if (!product || !product.isActive) {
			throw new AppError('PRODUCT_NOT_FOUND')
		}

		const price = data.price ?? product.price
		const cost = product.avgCost ?? product.cost ?? null

		const amounts = calculateSaleItemAmounts({
			quantity: data.quantity,
			price,
			discount: data.discount,
			taxRate: product.taxRate,
		})

		await createSaleItemRepo(tx, {
			saleId,
			productId: product.id,
			quantity: data.quantity,
			price,
			cost,
			discount: amounts.discount,
			subtotal: amounts.subtotal,
			tax: amounts.tax,
			total: amounts.total,
		})

		if (product.trackStock) {
			await applyMovementInTransaction({
				tx,
				userId,
				productId: product.id,
				type: MovementType.OUT,
				quantity: data.quantity,
				reason: `Venta ${saleId} - ${product.name}`,
			})
		}

		const totals = await getSaleTotalsRepo(tx, saleId)

		const updatedSale = await updateSaleTotalsRepo(tx, saleId, totals)
		const paidAmount = updatedSale.payments.reduce(
			(total, payment) => total + payment.amount,
			0,
		)
		const refundedAmount = updatedSale.refunds.reduce(
			(total, refund) => total + refund.amount,
			0,
		)

		return withSalePaymentAmounts(updatedSale, paidAmount, refundedAmount)
	})
}
