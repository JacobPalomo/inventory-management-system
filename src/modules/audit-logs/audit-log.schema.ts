import z from 'zod'
import {
	TZodAuditLogQuery,
	TZodAuditLogsByEntityParams,
} from './audit-log.types'
import { AuditAction, EntityType } from '@prisma/client'

export const auditLogQuerySchema = z.object<TZodAuditLogQuery>({
	page: z
		.number('No es un número válido')
		.nonnegative('No puede ser menor a 0'),
	limit: z
		.number('No es un número válido')
		.nonnegative('No puede ser menor a 0'),
	entityId: z.uuid('No es un ID válido').optional(),
	entity: z.enum(EntityType, 'No es una entidad válida').optional(),
	userId: z.uuid('No es un ID válido').optional(),
	action: z.enum(AuditAction, 'No es una acción válida').optional(),
	dateFrom: z.coerce
		.date<string>()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
	dateTo: z.coerce
		.date<string>()
		.refine(d => !isNaN(d.getTime()), 'Fecha inválida')
		.optional(),
})

export const auditLogsByEntityParamsSchema =
	z.object<TZodAuditLogsByEntityParams>({
		entity: z.enum(EntityType, 'No es una entidad válida'),
		entityId: z.uuid(),
	})
