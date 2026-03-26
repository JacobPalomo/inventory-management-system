import { AuditAction, EntityType, Prisma } from '@prisma/client'
import z from 'zod'
import { PaginationQuery, TZodPaginationQuery } from '../../types/pagination'
export interface TAuditLog {
	id: string
	userId: string
	user: {
		name: string
	}
	action: AuditAction
	entityId: string
	entity: EntityType
	oldValue: Prisma.JsonValue | null
	newValue: Prisma.JsonValue | null
	createdAt: Date
}

export interface TCreateAuditLog {
	userId: string
	action: AuditAction
	entity: EntityType
	entityId: string
	oldValue?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput
	newValue?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput
}

export const auditLogSelect: Prisma.AuditLogSelect = {
	id: true,
	userId: true,
	user: {
		select: {
			name: true,
		},
	},
	action: true,
	entityId: true,
	entity: true,
	oldValue: true,
	newValue: true,
	createdAt: true,
}

export interface TAuditLogsByEntityParams {
	entity: EntityType
	entityId: string
}

export interface TZodAuditLogsByEntityParams {
	entity: z.ZodEnum
	entityId: z.ZodUUID
}

export interface TAuditLogQuery extends PaginationQuery {
	entity?: EntityType
	entityId?: string
	userId?: string
	dateFrom?: Date
	dateTo?: Date
	action?: AuditAction
}

export interface TZodAuditLogQuery extends TZodPaginationQuery {
	entityId?: z.ZodOptional<z.ZodUUID>
	entity?: z.ZodOptional<z.ZodEnum>
	userId?: z.ZodOptional<z.ZodUUID>
	dateFrom?: z.ZodOptional<z.ZodCoercedDate<string>>
	dateTo?: z.ZodOptional<z.ZodCoercedDate<string>>
	action?: z.ZodOptional<z.ZodEnum>
}
