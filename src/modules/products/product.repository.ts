import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import {
	TProductList,
	TProductDetail,
	productListSelect,
	productDetailSelect,
	productInternalSelect,
} from './product.types'
import { TCreateProduct, TUpdateProductSchema } from './product.schema'

export const createProductRepo = async (
	data: TCreateProduct,
): Promise<TProductDetail> => {
	return prisma.product.create({
		data: { ...data, avgCost: data.cost },
		select: productDetailSelect,
	})
}

export const getProductsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.ProductWhereInput
	orderBy?: Prisma.ProductOrderByWithRelationInput
}): Promise<{ data: TProductList[]; total: number }> => {
	const { skip, take, where, orderBy } = params

	const [data, total] = await Promise.all([
		prisma.product.findMany({
			where,
			skip,
			take,
			orderBy: orderBy ?? { createdAt: 'desc' },
			select: productListSelect,
		}),
		prisma.product.count({ where }),
	])

	return { data, total }
}

export const getProductByIdRepo = async (
	id: string,
): Promise<TProductDetail | null> => {
	return prisma.product.findUnique({
		where: { id },
		select: productDetailSelect,
	})
}

export const getProductByBarcodeRepo = (
	barcode: string,
): Promise<TProductDetail | null> => {
	return prisma.product.findFirst({
		where: { barcode },
		select: productDetailSelect,
	})
}

export const getProductBySkuRepo = (
	sku: string,
): Promise<TProductDetail | null> => {
	return prisma.product.findFirst({
		where: { sku },
		select: productDetailSelect,
	})
}

export const getProductsLowStockRepo = async (params: {
	skip: number
	take: number
	whereSql?: Prisma.Sql
	orderBySql?: Prisma.Sql
}): Promise<{ data: TProductList[]; total: number }> => {
	const { skip, take, whereSql, orderBySql } = params

	const baseWhere = whereSql ? Prisma.sql`AND ${whereSql}` : Prisma.empty
	const orderBy = orderBySql ?? Prisma.sql`ORDER BY "createdAt" DESC`

	const data = await prisma.$queryRaw<TProductList[]>(Prisma.sql`
		SELECT 
			"id",
			"name",
			"price",
			"stock",
			"minStock",
			"isActive"
		FROM "Product"
		WHERE "stock" <= "minStock"
		${baseWhere}
		${orderBy}
		OFFSET ${skip}
		LIMIT ${take}
	`)

	const totalResult = await prisma.$queryRaw<{ count: bigint }[]>(Prisma.sql`
		SELECT COUNT(*) as count
		FROM "Product"
		WHERE "stock" <= "minStock"
		${baseWhere}
	`)

	const total = Number(totalResult[0]?.count ?? 0)

	return { data, total }
}

export const getProductInternalByIdRepo = async (id: string) => {
	return prisma.product.findUnique({
		where: { id },
		select: productInternalSelect,
	})
}

export const updateProductRepo = async (
	id: string,
	data: TUpdateProductSchema,
): Promise<TProductDetail> => {
	return prisma.product.update({
		where: { id },
		data,
		select: productDetailSelect,
	})
}

export const updateProductStockRepo = (id: string, stock: number) => {
	return prisma.product.update({
		where: { id },
		data: { stock },
		select: productDetailSelect,
	})
}

export const deleteProductRepo = async (
	id: string,
): Promise<TProductDetail> => {
	return prisma.product.update({
		where: { id },
		data: {
			isActive: false,
		},
		select: productDetailSelect,
	})
}

export const restoreProductRepo = (id: string) => {
	return prisma.product.update({
		where: { id },
		data: { isActive: true },
		select: productDetailSelect,
	})
}
