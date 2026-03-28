import { AuditAction, EntityType, Prisma } from '@prisma/client'
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
