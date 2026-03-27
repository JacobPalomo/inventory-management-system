import { z } from 'zod'
import { AuditAction, EntityType } from '@prisma/client'
import {
	paginationSchema,
	withPagination,
} from '../../shared/schemas/pagination.schema'

const auditLogsFilterSchema = z.object({
	entityId: z.uuid('No es un ID válido').optional(),
	entity: z.enum(EntityType, 'No es una entidad válida').optional(),
	userId: z.uuid('No es un ID válido').optional(),
	action: z.enum(AuditAction, 'No es una acción válida').optional(),
	dateFrom: z.coerce
		.date()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
	dateTo: z.coerce
		.date()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
})

export const auditLogsQuerySchema = withPagination(auditLogsFilterSchema)

export type TAuditLogsQuery = z.infer<typeof auditLogsQuerySchema>

export const auditLogsByEntityParamsSchema = z.object({
	entity: z.enum(EntityType),
	entityId: z.uuid('No es un ID válido'),
})

export const auditLogsByEntityQuerySchema = paginationSchema
