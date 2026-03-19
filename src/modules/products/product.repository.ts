import { prisma } from '../../config/prisma'

export const createProductRepo = (data: any) => {
	return prisma.product.create({ data })
}

export const getProductsRepo = () => {
	return prisma.product.findMany()
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
