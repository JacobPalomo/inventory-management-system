import { AuditAction, EntityType, Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { TCashRegister } from './cash-register.types'
import { getDiff } from '../audit-logs/audit-log.utils'
import { createAuditLog } from '../audit-logs/audit-log.helpers'
import {
	TCreateCashRegister,
	TUpdateCashRegister,
} from './cash-register.schema'

const select: Prisma.CashRegisterSelect = {
	id: true,
	name: true,
	description: true,
	isActive: true,
	createdAt: true,
}

export const findCashRegisterByIdRepo = async (
	id: string,
): Promise<TCashRegister | null> => {
	return await prisma.cashRegister.findUnique({
		select,
		where: { id },
	})
}

export const findCashRegisterByNameRepo = async (
	name: string,
): Promise<TCashRegister | null> => {
	return await prisma.cashRegister.findFirst({
		select,
		where: {
			name: {
				contains: name,
				mode: 'insensitive',
			},
		},
	})
}

export const findCashRegistersRepo = async (params: {
	skip: number
	take: number
	where: Prisma.CashRegisterWhereInput
}): Promise<{ data: TCashRegister[]; total: number }> => {
	const { skip, take, where } = params

	const [data, total] = await Promise.all([
		prisma.cashRegister.findMany({
			select,
			where,
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.cashRegister.count(),
	])

	return { data, total }
}

export const createCashRegisterRepo = async (
	userId: string,
	data: TCreateCashRegister,
): Promise<TCashRegister> => {
	const cashRegister = await prisma.cashRegister.create({
		select,
		data,
	})

	const { createdAt, ...safeCashRegister } = cashRegister as TCashRegister

	await createAuditLog({
		userId,
		action: AuditAction.CREATE,
		entity: EntityType.CashRegister,
		entityId: cashRegister.id,
		newValue: {
			...safeCashRegister,
			createdAt: createdAt.toISOString(),
		},
	})

	return cashRegister
}

export const updateCashRegisterRepo = async (
	cashRegister: TCashRegister,
	userId: string,
	data: TUpdateCashRegister,
): Promise<TCashRegister> => {
	const updatedCashRegister = await prisma.cashRegister.update({
		select,
		where: { id: cashRegister.id },
		data,
	})

	const { createdAt, ...safeUpdatedCashRegister } =
		updatedCashRegister as TCashRegister

	const { oldValue, newValue } = getDiff(cashRegister, safeUpdatedCashRegister)

	await createAuditLog({
		userId,
		action: AuditAction.UPDATE,
		entity: EntityType.CashRegister,
		entityId: cashRegister.id,
		oldValue,
		newValue,
	})

	return updatedCashRegister
}

export const updateCashRegisterStatusRepo = async (
	userId: string,
	cashRegister: TCashRegister,
): Promise<TCashRegister> => {
	const updatedCashRegister = await prisma.cashRegister.update({
		select,
		where: { id: cashRegister.id },
		data: { isActive: !cashRegister.isActive },
	})

	const { createdAt, ...safeUpdatedCashRegister } =
		updatedCashRegister as TCashRegister

	const { oldValue, newValue } = getDiff(cashRegister, safeUpdatedCashRegister)

	await createAuditLog({
		userId,
		action: AuditAction.UPDATE,
		entity: EntityType.CashRegister,
		entityId: cashRegister.id,
		oldValue,
		newValue,
	})

	return updatedCashRegister
}
