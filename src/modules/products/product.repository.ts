import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { TCreateProduct, TUpdateProduct } from './product.types'

export const createProductRepo = (data: TCreateProduct) => {
	return prisma.product.create({ data })
}

export const getProductsRepo = async (params: {
	skip: number
	take: number
	where: Prisma.ProductWhereInput
}) => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.product.findMany({
			where,
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.product.count(),
	])

	return { data, total }
}

export const getProductByIdRepo = (id: string) => {
	return prisma.product.findUnique({ where: { id } })
}

export const updateProductRepo = (id: string, data: TUpdateProduct) => {
	return prisma.product.update({
		where: { id },
		data,
	})
}

export const deleteProductRepo = (id: string) => {
	return prisma.product.delete({
		where: { id },
	})
}
