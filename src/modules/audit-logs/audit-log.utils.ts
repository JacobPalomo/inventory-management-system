import { Prisma } from '@prisma/client'

const serialize = (value: any): any => {
	if (value instanceof Date) return value.toISOString()
	if (Array.isArray(value)) return value.map(serialize)
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, serialize(v)]),
		)
	}
	return value
}

export const getDiff = (
	oldObj: Record<string, any>,
	newObj: Record<string, any>,
): {
	oldValue: Prisma.JsonObject
	newValue: Prisma.JsonObject
} => {
	const oldSerialized = serialize(oldObj)
	const newSerialized = serialize(newObj)

	const oldValue: Record<string, any> = {}
	const newValue: Record<string, any> = {}

	for (const key of Object.keys(newSerialized)) {
		if (oldSerialized[key] !== newSerialized[key]) {
			oldValue[key] = oldSerialized[key]
			newValue[key] = newSerialized[key]
		}
	}

	return {
		oldValue,
		newValue,
	}
}
