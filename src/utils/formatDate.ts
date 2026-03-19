import { env } from '../config/env'
import { startOfDay, endOfDay } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'

export function formatFromDate(date: Date): Date {
	return fromZonedTime(startOfDay(date), env.TIMEZONE)
}

export function formatToDate(date: Date): Date {
	return fromZonedTime(endOfDay(date), env.TIMEZONE)
}

export function formatDate(date: Date): Date {
	return fromZonedTime(date, env.TIMEZONE)
}
