import z from 'zod'

export interface TZodCreateProduct {
	name: z.ZodString
	description?: z.ZodOptional<z.ZodString>
	stock: z.ZodNumber
	minStock: z.ZodNumber
}

export interface TCreateProduct {
	name: string
	description?: string
	stock: number
	minStock: number
}

export interface TZodUpdateProduct {
	name?: z.ZodOptional<z.ZodString>
	description?: z.ZodOptional<z.ZodString>
	minStock?: z.ZodOptional<z.ZodNumber>
	isActive?: z.ZodOptional<z.ZodBoolean>
}

export interface TUpdateProduct extends Partial<TCreateProduct> {}
