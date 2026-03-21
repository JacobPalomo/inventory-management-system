import z from 'zod'
import { PaginationQuery } from '../../types/pagination'

export interface ShiftQuery extends PaginationQuery {
	search?: string
	isActive?: string
}

export interface ShiftResponse {
	id: string
	name: string
	startTime: string
	endTime: string
	isActive: boolean
	createdAt: Date
}

export interface TZodCreateShift {
	name: z.ZodString
	startTime: z.ZodNumber
	endTime: z.ZodNumber
}

export interface TCreateShift {
	name: string
	startTime: number
	endTime: number
}

export interface TZodUpdateShift {
	name?: z.ZodOptional<z.ZodString>
	startTime?: z.ZodOptional<z.ZodNumber>
	endTime?: z.ZodOptional<z.ZodNumber>
	isActive?: z.ZodOptional<z.ZodBoolean>
}

export interface TUpdateShift extends Partial<TCreateShift> {
	isActive?: boolean
}
