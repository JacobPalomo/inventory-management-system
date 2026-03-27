import { Prisma } from '@prisma/client'

export const productListSelect = {
	id: true,
	name: true,
	price: true,
	stock: true,
	minStock: true,
	isActive: true,
} satisfies Prisma.ProductSelect

/**
 * Representación de producto para listados.
 *
 * Usar cuando:
 * - Devuelvas listas paginadas de productos
 * - Muestres tablas o grids
 * - Implementes búsquedas
 *
 * Características:
 * - Payload ligero
 * - No incluye costos (cost, avgCost)
 * - Optimizado para performance
 *
 * Endpoints típicos:
 * GET /products
 */
export type TProductList = Prisma.ProductGetPayload<{
	select: typeof productListSelect
}>

export const productDetailSelect = {
	id: true,
	barcode: true,
	sku: true,
	name: true,
	description: true,
	price: true,
	stock: true,
	reservedStock: true,
	minStock: true,
	maxStock: true,
	taxRate: true,
	trackStock: true,
	allowNegative: true,
	isActive: true,
} satisfies Prisma.ProductSelect

/**
 * Representación de producto para detalle.
 *
 * Úsalo cuando:
 * - Devuelvas un producto individual
 * - Muestres la vista de detalle
 * - Permitas editar información del producto
 *
 * Características:
 * - Incluye toda la información pública del producto
 * - Excluye datos sensibles como costos
 *
 * Endpoints típicos:
 * GET /products/:id
 */
export type TProductDetail = Prisma.ProductGetPayload<{
	select: typeof productDetailSelect
}>

export const productInternalSelect = {
	id: true,
	cost: true,
	avgCost: true,
	stock: true,
} satisfies Prisma.ProductSelect

/**
 * Representación interna del producto.
 *
 * ⚠️ Contiene información sensible (cost, avgCost).
 *
 * Úsalo SOLO en:
 * - Services
 * - Lógica de inventario
 * - Cálculos de costo o utilidad
 * - Movimientos de stock
 *
 * ❌ NO usar en controllers ni exponer en la API.
 *
 * Casos de uso:
 * - Recalcular avgCost
 * - Ajustes de inventario
 * - Procesos de compra
 */
export type TProductInternal = Prisma.ProductGetPayload<{
	select: typeof productInternalSelect
}>
