import { Prisma, SaleStatus } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { saleDetailSelect, TSaleDetail } from '../sales/sale.types'
import { paymentSelect, TPayment } from './payment.types'

export const findPaymentsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.PaymentWhereInput
	orderBy: Prisma.PaymentOrderByWithRelationInput
}): Promise<{ data: TPayment[]; total: number }> => {
	const { skip, take, where, orderBy } = params

	const [data, total] = await Promise.all([
		prisma.payment.findMany({
			where,
			select: paymentSelect,
			skip,
			take,
			orderBy,
		}),
		prisma.payment.count({ where }),
	])

	return { data, total }
}

export const getPaymentByIdRepo = async (
	id: string,
): Promise<TPayment | null> => {
	return prisma.payment.findUnique({
		where: { id },
		select: paymentSelect,
	})
}

export const getSaleForPaymentRepo = async (
	tx: Prisma.TransactionClient,
	id: string,
) => {
	return tx.sale.findUnique({
		where: { id },
		select: {
			id: true,
			sessionId: true,
			status: true,
			total: true,
			isVoided: true,
			cancelledAt: true,
		},
	})
}

export const getCashSessionStatusForPaymentRepo = async (
	tx: Prisma.TransactionClient,
	id: string,
) => {
	return tx.cashSession.findUnique({
		where: { id },
		select: {
			id: true,
			status: true,
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

export const createPaymentRepo = async (
	tx: Prisma.TransactionClient,
	data: Prisma.PaymentUncheckedCreateInput,
): Promise<TPayment> => {
	return tx.payment.create({
		data,
		select: paymentSelect,
	})
}

export const updateSaleStatusAfterPaymentRepo = async (
	tx: Prisma.TransactionClient,
	saleId: string,
	status: SaleStatus,
): Promise<TSaleDetail> => {
	return tx.sale.update({
		where: { id: saleId },
		data: { status },
		select: saleDetailSelect,
	})
}
