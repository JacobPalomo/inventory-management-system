import { SaleItemStatus } from '@prisma/client'
import { AppError } from '../../shared/utils/AppError'
import { roundMoney } from '../sales/sale.utils'
import { TCreateRefund } from './refund.schema'

type TRefundedItemTotals = {
	quantity: number
	subtotal: number
	discount: number
	tax: number
	total: number
}

type TSaleItemForRefund = {
	id: string
	quantity: number
	subtotal: number
	discount: number
	tax: number
	total: number
	status: SaleItemStatus
	isVoided: boolean
	cancelledAt: Date | null
	productId: string
	product: {
		id: string
		name: string
		trackStock: boolean
		isActive: boolean
	}
	refundItems: Array<{
		quantity: number
		subtotal: number
		discount: number
		tax: number
		total: number
	}>
}

export type TResolvedRefundItem = {
	saleItemId: string
	productId: string
	productName: string
	trackStock: boolean
	quantity: number
	subtotal: number
	discount: number
	tax: number
	total: number
	shouldMarkAsRefunded: boolean
}

const sumRefundedItemTotals = (
	refundItems: TSaleItemForRefund['refundItems'],
): TRefundedItemTotals =>
	refundItems.reduce<TRefundedItemTotals>(
		(acc, refundItem) => ({
			quantity: acc.quantity + refundItem.quantity,
			subtotal: roundMoney(acc.subtotal + refundItem.subtotal),
			discount: roundMoney(acc.discount + refundItem.discount),
			tax: roundMoney(acc.tax + refundItem.tax),
			total: roundMoney(acc.total + refundItem.total),
		}),
		{
			quantity: 0,
			subtotal: 0,
			discount: 0,
			tax: 0,
			total: 0,
		},
	)

const quantitiesMatch = (left: number, right: number) =>
	Math.abs(left - right) < 1e-6

const calculatePartialAmount = (params: {
	remainingAmount: number
	requestedQuantity: number
	remainingQuantity: number
}) => {
	const { remainingAmount, requestedQuantity, remainingQuantity } = params

	return roundMoney((remainingAmount * requestedQuantity) / remainingQuantity)
}

export const resolveRefundItems = (params: {
	saleItems: TSaleItemForRefund[]
	requestedItems: TCreateRefund['items']
}): TResolvedRefundItem[] => {
	const { saleItems, requestedItems } = params

	return requestedItems.map(requestedItem => {
		const saleItem = saleItems.find(item => item.id === requestedItem.saleItemId)

		if (!saleItem) {
			throw new AppError('REFUND_ITEM_NOT_FOUND')
		}

		if (
			saleItem.isVoided ||
			saleItem.cancelledAt ||
			saleItem.status === SaleItemStatus.CANCELLED
		) {
			throw new AppError('REFUND_ITEM_NOT_REFUNDABLE')
		}

		const refundedTotals = sumRefundedItemTotals(saleItem.refundItems)
		const remainingQuantity = saleItem.quantity - refundedTotals.quantity

		if (remainingQuantity <= 0 || saleItem.status === SaleItemStatus.REFUNDED) {
			throw new AppError('REFUND_ITEM_NOT_REFUNDABLE')
		}

		if (requestedItem.quantity > remainingQuantity) {
			throw new AppError('REFUND_ITEM_EXCEEDS_AVAILABLE_QUANTITY')
		}

		const remainingSubtotal = roundMoney(saleItem.subtotal - refundedTotals.subtotal)
		const remainingDiscount = roundMoney(saleItem.discount - refundedTotals.discount)
		const remainingTax = roundMoney(saleItem.tax - refundedTotals.tax)
		const remainingTotal = roundMoney(saleItem.total - refundedTotals.total)

		const shouldMarkAsRefunded = quantitiesMatch(
			requestedItem.quantity,
			remainingQuantity,
		)

		const subtotal = shouldMarkAsRefunded
			? remainingSubtotal
			: calculatePartialAmount({
					remainingAmount: remainingSubtotal,
					requestedQuantity: requestedItem.quantity,
					remainingQuantity,
				})
		const discount = shouldMarkAsRefunded
			? remainingDiscount
			: calculatePartialAmount({
					remainingAmount: remainingDiscount,
					requestedQuantity: requestedItem.quantity,
					remainingQuantity,
				})
		const tax = shouldMarkAsRefunded
			? remainingTax
			: calculatePartialAmount({
					remainingAmount: remainingTax,
					requestedQuantity: requestedItem.quantity,
					remainingQuantity,
				})
		const total = shouldMarkAsRefunded
			? remainingTotal
			: calculatePartialAmount({
					remainingAmount: remainingTotal,
					requestedQuantity: requestedItem.quantity,
					remainingQuantity,
				})

		return {
			saleItemId: saleItem.id,
			productId: saleItem.productId,
			productName: saleItem.product.name,
			trackStock: saleItem.product.trackStock,
			quantity: requestedItem.quantity,
			subtotal,
			discount,
			tax,
			total,
			shouldMarkAsRefunded,
		}
	})
}

export const sumResolvedRefundAmount = (
	items: TResolvedRefundItem[],
): number =>
	roundMoney(items.reduce((acc, item) => acc + item.total, 0))
