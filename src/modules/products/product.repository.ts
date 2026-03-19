import { prisma } from '../../config/prisma'

export const createProductRepo = (data: any) => {
	return prisma.product.create({ data })
}

export const getProductsRepo = async (params: {
	skip: number
	take: number
	where: any
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

export const updateProductRepo = (id: string, data: any) => {
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
