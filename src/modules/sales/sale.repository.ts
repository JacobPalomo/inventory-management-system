import { Prisma, SaleItemStatus } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { TCreateSale, TSalesQuery } from './sale.schema'
import { buildSalesSelect, normalizeSaleTotals } from './sale.utils'
import {
	saleDetailSelect,
	saleItemSelect,
	saleSelect,
	TSaleDetailRaw,
	TSaleRaw,
} from './sale.types'

export const createSaleRepo = async (
	userId: string,
	data: TCreateSale,
): Promise<TSaleRaw> => {
	const { customerId, sessionId, notes } = data

	return await prisma.sale.create({
		select: saleSelect,
		data: {
			userId,
			sessionId,
			customerId,
			notes: notes?.trim() || null,
			subtotal: 0,
			tax: 0,
			discount: 0,
			total: 0,
		},
	})
}

export const findSalesRepo = async (params: {
	skip: number
	take: number
	where: Prisma.SaleWhereInput
	query: TSalesQuery
}): Promise<{ data: Array<TSaleRaw | TSaleDetailRaw>; total: number }> => {
	const {
		skip,
		take,
		where,
		query: { withItems, sortBy, sortOrder },
	} = params

	const [data, total] = await Promise.all([
		prisma.sale.findMany({
			select: buildSalesSelect(withItems),
			where,
			skip,
			take,
			orderBy: {
				[sortBy]: sortOrder,
			},
		}),
		prisma.sale.count({ where }),
	])

	return { data, total }
}

export const getSaleByIdRepo = async (
	id: string,
): Promise<TSaleDetailRaw | null> => {
	return prisma.sale.findUnique({
		where: { id },
		select: saleDetailSelect,
	})
}

export const getPaidAmountsBySaleIdsRepo = async (
	saleIds: string[],
): Promise<Map<string, number>> => {
	if (!saleIds.length) {
		return new Map()
	}

	const paymentsGroupedBySale = await prisma.payment.groupBy({
		by: ['saleId'],
		where: {
			saleId: {
				in: saleIds,
			},
		},
		_sum: {
			amount: true,
		},
	})

	return new Map(
		paymentsGroupedBySale.map(payment => [
			payment.saleId,
			payment._sum.amount ?? 0,
		]),
	)
}

export const getSaleEditableStateRepo = async (
	tx: Prisma.TransactionClient,
	id: string,
) => {
	return tx.sale.findUnique({
		where: { id },
		select: {
			id: true,
			status: true,
			isVoided: true,
			cancelledAt: true,
		},
	})
}

export const getProductForSaleRepo = async (
	tx: Prisma.TransactionClient,
	productId: string,
) => {
	return tx.product.findUnique({
		where: { id: productId },
		select: {
			id: true,
			name: true,
			price: true,
			cost: true,
			avgCost: true,
			taxRate: true,
			trackStock: true,
			isActive: true,
		},
	})
}

export const createSaleItemRepo = async (
	tx: Prisma.TransactionClient,
	data: Prisma.SaleItemUncheckedCreateInput,
) => {
	return tx.saleItem.create({
		data: {
			...data,
		},
		select: saleItemSelect,
	})
}

export const getSaleTotalsRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
) => {
	const result = await tx.saleItem.aggregate({
		where: {
			saleId,
			status: SaleItemStatus.ACTIVE,
			isVoided: false,
			cancelledAt: null,
		},
		_sum: {
			subtotal: true,
			discount: true,
			tax: true,
			total: true,
		},
	})

	return normalizeSaleTotals({
		subtotal: result._sum.subtotal,
		discount: result._sum.discount,
		tax: result._sum.tax,
		total: result._sum.total,
	})
}

export const updateSaleTotalsRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
	totals: {
		subtotal: number
		discount: number
		tax: number
		total: number
	},
): Promise<TSaleDetailRaw> => {
	return tx.sale.update({
		where: { id: saleId },
		data: totals,
		select: saleDetailSelect,
	})
}
