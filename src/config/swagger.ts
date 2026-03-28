import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'

export const swaggerSpec = swaggerJsdoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Inventory Management API',
			version: '1.0.0',
			description:
				'API profesional para gestión de inventario con control de roles, movimientos y autenticación JWT',
		},

		servers: [
			{
				url: 'http://localhost:3000',
			},
		],

		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},

			schemas: {
				Role: {
					type: 'string',
					enum: ['ADMIN', 'EDITOR', 'VIEWER'],
				},

				// AUDITORÍA
				AuditAction: {
					type: 'string',
					enum: ['CREATE', 'UPDATE', 'DELETE', 'STOCK_ADJUST', 'PRICE_CHANGE'],
					example: 'UPDATE',
				},
				EntityType: {
					type: 'string',
					enum: [
						'Auth',
						'Movement',
						'Product',
						'Shift',
						'User',
						'CashSession',
						'CashRegister',
					],
					example: 'User',
				},
				AuditLog: {
					type: 'object',
					required: [
						'id',
						'userId',
						'user',
						'action',
						'entityId',
						'entity',
						'createdAt',
					],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: 'cd872b4e-0a10-499b-bb63-d177f91f65c7',
						},
						action: {
							$ref: '#/components/schemas/AuditAction',
						},
						userId: {
							type: 'string',
							format: 'uuid',
							example: 'a2474e24-8a76-4c9a-96f4-c3c1eaa77f96',
						},
						user: {
							type: 'object',
							required: ['name'],
							properties: {
								name: {
									type: 'string',
									example: 'Jacob',
								},
							},
						},
						entityId: {
							type: 'string',
							format: 'uuid',
							example: '3fb8bed4-38d4-415a-b949-f9591d41770b',
						},
						entity: {
							$ref: '#/components/schemas/EntityType',
						},
						oldValue: {
							type: 'object',
							nullable: true,
							additionalProperties: true,
							description: 'Valor antes del cambio (JSON dinámico)',
						},
						newValue: {
							type: 'object',
							nullable: true,
							additionalProperties: true,
							description: 'Valor después del cambio (JSON dinámico)',
						},
						createdAt: {
							type: 'string',
							format: 'ISODate',
							example: '2026-03-26T18:25:43.511Z',
						},
					},
				},

				// 🔐 USER
				User: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '6e8d02df-cb0e-484a-ab73-38a72b69752d',
						},
						name: { type: 'string', example: 'Jacob' },
						email: { type: 'string', example: 'jacob@test.com' },
						role: {
							$ref: '#/components/schemas/Role',
						},
						shiftId: {
							type: 'string',
							format: 'uuid',
							example: '53a05a32-2f73-45e3-aed5-a6dd2883d5e6',
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-03-19T23:57:02.901Z',
						},
						createdById: {
							type: 'string',
							format: 'uuid',
							example: '6c5dd545-29f9-48be-84bc-94e0752a58af',
						},
					},
				},

				// ⏱️ SHIFT
				Shift: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: 'a9e660c3-f204-4662-9d43-d1a72c6a1d86',
						},
						name: { type: 'string', example: 'Matutino' },
						startTime: { type: 'string', example: '08:00' }, // 480 en minutos
						endTime: { type: 'string', example: '16:30' }, // 990 en minutos
						isActive: { type: 'boolean', example: true },
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-03-19T23:57:02.901Z',
						},
					},
				},

				// 🔐 AUTH RESPONSE
				AuthResponse: {
					type: 'object',
					properties: {
						token: {
							type: 'string',
							format: 'jwt',
							example:
								'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
						},
						user: {
							$ref: '#/components/schemas/User',
						},
					},
				},

				// 📦 PRODUCT
				Product: {
					type: 'object',
					required: ['id', 'name', 'price', 'stock', 'minStock', 'isActive'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						barcode: {
							type: 'string',
							example: '7501234567890',
							nullable: true,
						},
						sku: {
							type: 'string',
							example: 'LAP-HP-001',
							nullable: true,
						},
						name: {
							type: 'string',
							example: 'Laptop HP',
						},
						description: {
							type: 'string',
							example: 'Laptop HP 16GB RAM',
							nullable: true,
						},
						price: {
							type: 'number',
							example: 15000,
						},
						stock: {
							type: 'number',
							example: 10,
						},
						reservedStock: {
							type: 'number',
							example: 2,
						},
						minStock: {
							type: 'number',
							example: 3,
						},
						maxStock: {
							type: 'number',
							example: 50,
							nullable: true,
						},
						taxRate: {
							type: 'number',
							example: 0.16,
						},
						trackStock: {
							type: 'boolean',
							example: true,
						},
						allowNegative: {
							type: 'boolean',
							example: false,
						},
						isActive: {
							type: 'boolean',
							example: true,
						},
					},
				},

				ProductList: {
					type: 'object',
					required: ['id', 'name', 'price', 'stock', 'minStock', 'isActive'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						name: {
							type: 'string',
							example: 'Laptop HP',
						},
						price: {
							type: 'number',
							example: 15000,
						},
						stock: {
							type: 'number',
							example: 10,
						},
						minStock: {
							type: 'number',
							example: 3,
						},
						isActive: {
							type: 'boolean',
							example: true,
						},
					},
				},

				// 🔄 MOVEMENT
				Movement: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '376dda7c-4a25-446d-be54-eea3f2f9d6ce',
						},
						type: {
							type: 'string',
							enum: ['IN', 'OUT'],
							example: 'OUT',
						},
						productId: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						userId: {
							type: 'string',
							format: 'uuid',
							example: '6e8d02df-cb0e-484a-ab73-38a72b69752d',
						},
						quantity: { type: 'integer', example: 5 },
						cost: {
							type: 'number',
							example: 145.9,
							nullable: true,
						},
						reason: {
							type: 'string',
							example: 'Ajuste por conteo físico',
							nullable: true,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-01-01T00:00:00Z',
						},
						product: {
							type: 'object',
							properties: {
								id: {
									type: 'string',
									format: 'uuid',
									example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
								},
								name: {
									type: 'string',
									example: 'Laptop HP',
								},
								sku: {
									type: 'string',
									example: 'LAP-HP-001',
									nullable: true,
								},
								barcode: {
									type: 'string',
									example: '7501234567890',
									nullable: true,
								},
								stock: {
									type: 'number',
									example: 10,
								},
								trackStock: {
									type: 'boolean',
									example: true,
								},
								isActive: {
									type: 'boolean',
									example: true,
								},
							},
						},
						user: {
							type: 'object',
							properties: {
								id: {
									type: 'string',
									format: 'uuid',
									example: '6e8d02df-cb0e-484a-ab73-38a72b69752d',
								},
								name: {
									type: 'string',
									example: 'Jacob',
								},
								email: {
									type: 'string',
									example: 'jacob@test.com',
								},
								role: {
									$ref: '#/components/schemas/Role',
								},
							},
						},
					},
				},

				CashRegister: {
					type: 'object',
					required: ['id', 'name', 'isActive', 'createdAt'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '5d2b4903-af5a-4784-9436-fe734750730e',
						},
						name: {
							type: 'string',
							example: 'Caja 1',
						},
						description: {
							type: 'string',
							example: 'Caja principal',
						},
						isActive: {
							type: 'boolean',
							example: true,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-01-01T00:00:00Z',
						},
					},
				},

				SaleStatus: {
					type: 'string',
					enum: ['OPEN', 'PAID', 'CANCELLED', 'REFUNDED', 'HOLD', 'QUOTE'],
					example: 'OPEN',
				},

				SaleItemStatus: {
					type: 'string',
					enum: ['ACTIVE', 'CANCELLED', 'REFUNDED'],
					example: 'ACTIVE',
				},

				SaleUserSummary: {
					type: 'object',
					required: ['id', 'name'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '6e8d02df-cb0e-484a-ab73-38a72b69752d',
						},
						name: {
							type: 'string',
							example: 'Jacob',
						},
					},
				},

				SaleProductSummary: {
					type: 'object',
					required: ['id', 'name'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						name: {
							type: 'string',
							example: 'Laptop HP',
						},
						barcode: {
							type: 'string',
							example: '7501234567890',
							nullable: true,
						},
						sku: {
							type: 'string',
							example: 'LAP-HP-001',
							nullable: true,
						},
					},
				},

				SaleItem: {
					type: 'object',
					required: [
						'id',
						'productId',
						'product',
						'quantity',
						'price',
						'discount',
						'subtotal',
						'tax',
						'total',
						'status',
						'isVoided',
					],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '1787d74f-734b-46c2-82dd-5fb8eb8d6ae9',
						},
						productId: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						product: {
							$ref: '#/components/schemas/SaleProductSummary',
						},
						quantity: {
							type: 'number',
							example: 2,
						},
						price: {
							type: 'number',
							example: 15000,
						},
						cost: {
							type: 'number',
							example: 12000,
							nullable: true,
						},
						discount: {
							type: 'number',
							example: 500,
						},
						subtotal: {
							type: 'number',
							example: 30000,
						},
						tax: {
							type: 'number',
							example: 4720,
						},
						total: {
							type: 'number',
							example: 34220,
						},
						status: {
							$ref: '#/components/schemas/SaleItemStatus',
						},
						isVoided: {
							type: 'boolean',
							example: false,
						},
						voidedAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
						voidedById: {
							type: 'string',
							format: 'uuid',
							nullable: true,
						},
						cancelledAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
						cancelledById: {
							type: 'string',
							format: 'uuid',
							nullable: true,
						},
						cancelReason: {
							type: 'string',
							nullable: true,
							example: 'Cancelado por solicitud del cliente',
						},
					},
				},

				Sale: {
					type: 'object',
					required: [
						'id',
						'userId',
						'user',
						'status',
						'subtotal',
						'tax',
						'discount',
						'total',
						'isVoided',
						'createdAt',
						'updatedAt',
					],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '66cba4df-57f0-4b7b-a16b-3be12b72c4e3',
						},
						sessionId: {
							type: 'string',
							format: 'uuid',
							nullable: true,
							example: '50fa8bea-75de-45a2-b70b-5f68b8375fd7',
						},
						userId: {
							type: 'string',
							format: 'uuid',
							example: '6e8d02df-cb0e-484a-ab73-38a72b69752d',
						},
						user: {
							$ref: '#/components/schemas/SaleUserSummary',
						},
						customerId: {
							type: 'string',
							format: 'uuid',
							nullable: true,
							example: '7f1fb0e1-c406-4021-a0dd-4379069fb32a',
						},
						status: {
							$ref: '#/components/schemas/SaleStatus',
						},
						subtotal: {
							type: 'number',
							example: 30000,
						},
						tax: {
							type: 'number',
							example: 4720,
						},
						discount: {
							type: 'number',
							example: 500,
						},
						total: {
							type: 'number',
							example: 34220,
						},
						notes: {
							type: 'string',
							nullable: true,
							example: 'Venta mostrador',
						},
						isVoided: {
							type: 'boolean',
							example: false,
						},
						voidedAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
						voidedById: {
							type: 'string',
							format: 'uuid',
							nullable: true,
						},
						voidedBy: {
							allOf: [
								{ $ref: '#/components/schemas/SaleUserSummary' },
							],
							nullable: true,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-03-27T08:15:00.000Z',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
							example: '2026-03-27T08:20:00.000Z',
						},
						cancelledAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
						cancelledById: {
							type: 'string',
							format: 'uuid',
							nullable: true,
						},
						cancelledBy: {
							allOf: [
								{ $ref: '#/components/schemas/SaleUserSummary' },
							],
							nullable: true,
						},
						items: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/SaleItem',
							},
						},
					},
				},

				MovementType: {
					type: 'string',
					enum: ['IN', 'OUT'],
				},

				// 📄 PAGINACIÓN (BASE)
				PaginatedMeta: {
					type: 'object',
					properties: {
						total: { type: 'number', example: 50 },
						page: { type: 'number', example: 1 },
						limit: { type: 'number', example: 10 },
						totalPages: { type: 'number', example: 5 },
					},
				},

				PaginatedBase: {
					type: 'object',
					properties: {
						meta: {
							$ref: '#/components/schemas/PaginatedMeta',
						},
					},
				},

				// AUDITORÍA
				PaginatedAuditLogs: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/AuditLog',
									},
								},
							},
						},
						{ $ref: '#/components/schemas/PaginatedBase' },
					],
				},

				// 👤 USERS
				PaginatedUsers: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/User',
									},
								},
							},
						},
						{
							$ref: '#/components/schemas/PaginatedBase',
						},
					],
				},

				// 📦 PRODUCTS
				PaginatedProducts: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/ProductList',
									},
								},
							},
							example: {
								data: [
									{
										id: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
										name: 'Laptop HP',
										price: 15000,
										stock: 10,
										minStock: 3,
										isActive: true,
									},
								],
								meta: {
									total: 1,
									page: 1,
									limit: 10,
									totalPages: 1,
								},
							},
						},
						{
							$ref: '#/components/schemas/PaginatedBase',
						},
					],
				},

				// 🔄 MOVEMENTS
				PaginatedMovements: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Movement',
									},
								},
							},
						},
						{
							$ref: '#/components/schemas/PaginatedBase',
						},
					],
				},

				// ⏱️ SHIFTS
				PaginatedShifts: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Shift',
									},
								},
							},
						},
						{
							$ref: '#/components/schemas/PaginatedBase',
						},
					],
				},

				PaginatedCashRegisters: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/CashRegister',
									},
								},
							},
						},
						{ $ref: '#/components/schemas/PaginatedBase' },
					],
				},

				PaginatedSales: {
					allOf: [
						{
							type: 'object',
							properties: {
								data: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Sale',
									},
								},
							},
						},
						{ $ref: '#/components/schemas/PaginatedBase' },
					],
				},

				Error: {
					type: 'object',
					required: ['code', 'message'],
					properties: {
						code: {
							type: 'string',
							example: 'VALIDATION_ERROR',
						},
						message: {
							type: 'string',
							example: 'Error message',
						},
						details: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									field: { type: 'string' },
									message: { type: 'string' },
								},
							},
						},
					},
				},
			},

			responses: {
				// AUTH
				InvalidCredentialsError: {
					description: 'Credenciales inválidas',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'INVALID_CREDENTIALS',
								message: 'Credenciales inválidas',
							},
						},
					},
				},

				UnauthorizedError: {
					description: 'No autorizado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'UNAUTHORIZED',
								message: 'No autorizado',
							},
						},
					},
				},

				ForbiddenError: {
					description: 'Sin permisos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'FORBIDDEN',
								message: 'Sin permisos',
							},
						},
					},
				},

				// USERS
				UserNotFoundError: {
					description: 'Usuario no encontrado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'USER_NOT_FOUND',
								message: 'Usuario no encontrado',
							},
						},
					},
				},

				UserAlreadyExistsError: {
					description: 'Usuario ya existe',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'USER_ALREADY_EXISTS',
								message: 'Usuario ya existe',
							},
						},
					},
				},

				UserInvalidCurrentPasswordError: {
					description: 'La contraseña actual es incorrecta',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'USER_INVALID_CURRENT_PASSWORD',
								message: 'La contraseña actual es incorrecta',
							},
						},
					},
				},

				UserSamePasswordError: {
					description: 'La nueva contraseña es igual a la contraseña actual',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'USER_SAME_PASSWORD',
								message: 'La nueva contraseña es igual a la contraseña actual',
							},
						},
					},
				},

				// PRODUCTS
				ProductNotFoundError: {
					description: 'Producto no encontrado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_NOT_FOUND',
								message: 'Producto no encontrado',
							},
						},
					},
				},

				ProductAlreadyExistsError: {
					description: 'Ya existe un producto con ese identificador',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_ALREADY_EXISTS',
								message: 'Ya existe un producto con ese identificador',
							},
						},
					},
				},

				ProductAlreadyDeletedError: {
					description: 'El producto ya eliminado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_ALREADY_DELETED',
								message: 'El producto ya se encuentra eliminado',
							},
						},
					},
				},

				ProductInsufficientStockError: {
					description: 'Stock insuficiente',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_INSUFFICIENT_STOCK',
								message: 'Stock insuficiente',
							},
						},
					},
				},

				// SALES
				SaleNotFoundError: {
					description: 'Venta no encontrada',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'SALE_NOT_FOUND',
								message: 'Venta no encontrada',
							},
						},
					},
				},

				SaleNotEditableError: {
					description: 'La venta ya no puede modificarse',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'SALE_NOT_EDITABLE',
								message: 'La venta ya no puede modificarse',
							},
						},
					},
				},

				SaleInvalidItemDiscountError: {
					description: 'El descuento del item no puede ser mayor que el subtotal',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'SALE_INVALID_ITEM_DISCOUNT',
								message: 'El descuento del item no puede ser mayor que el subtotal',
							},
						},
					},
				},

				// SHIFTS
				ShiftNotFoundError: {
					description: 'Turno no encontrado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'SHIFT_NOT_FOUND',
								message: 'Turno no encontrado',
							},
						},
					},
				},

				ShiftOverlapError: {
					description: 'El turno se solapa con otro existente',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'SHIFT_OVERLAP',
								message: 'El turno se solapa con otro existente',
							},
						},
					},
				},

				// GENERIC
				ValidationError: {
					description: 'Error de validación',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'VALIDATION_ERROR',
								message: 'Error de validación',
								details: [
									{
										field: 'nombre_del_campo',
										message: 'Mensaje del error en ese campo',
									},
								],
							},
						},
					},
				},

				DeleteProductConflictError: {
					description: 'Conflicto relacionado con la eliminación de productos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_ALREADY_DELETED',
								message: 'El producto ya se encuentra eliminado',
							},
						},
					},
				},

				InvalidQueryParamsError: {
					description: 'Parámetros de consulta inválidos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'INVALID_QUERY_PARAMS',
								message: 'Parámetros de consulta inválidos',
							},
						},
					},
				},

				CreateProductConflictError: {
					description: 'Conflicto relacionado con la creación de productos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'PRODUCT_ALREADY_EXISTS',
								message: 'Ya existe un producto con ese identificador',
							},
						},
					},
				},

				UpdateProductConflictError: {
					description:
						'Conflicto relacionado con la actualización de productos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							examples: {
								productAlreadyExists: {
									summary: 'SKU o barcode duplicado',
									value: {
										code: 'PRODUCT_ALREADY_EXISTS',
										message: 'Ya existe un producto con ese identificador',
									},
								},
								productAlreadyDeleted: {
									summary: 'Producto ya eliminado',
									value: {
										code: 'PRODUCT_ALREADY_DELETED',
										message: 'El producto ya se encuentra eliminado',
									},
								},
							},
						},
					},
				},

				CashRegisterConflictError: {
					description: 'Conflicto relacionado con cajas registradoras',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							examples: {
								cashRegisterAlreadyExists: {
									summary: 'Caja registradora ya existe',
									value: {
										code: 'CASH_REGISTER_ALREADY_EXISTS',
										message: 'Caja registradora ya existe con ese nombre',
									},
								},
								cashRegisterInactive: {
									summary: 'Caja registradora inactiva',
									value: {
										code: 'CASH_REGISTER_IS_NOT_ACTIVE',
										message: 'La caja registradora no se encuentra activa',
									},
								},
							},
						},
					},
				},

				TooManyRequestsError: {
					description: 'Demasiadas solicitudes',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'TOO_MANY_REQUESTS',
								message: 'Demasiadas solicitudes',
							},
						},
					},
				},

				UnexpectedError: {
					description: 'Error interno del servidor',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
							example: {
								code: 'INTERNAL_SERVER_ERROR',
								message: 'Error interno del servidor',
							},
						},
					},
				},
			},
		},

		tags: [
			{ name: 'Auth', description: 'Autenticación' },
			{ name: 'Users', description: 'Gestión de usuarios' },
			{ name: 'Shifts', description: 'Turnos de empleados' },
			{ name: 'Products', description: 'Gestión de productos' },
			{ name: 'Movements', description: 'Movimientos de inventario' },
			{ name: 'Sales', description: 'Gestión de ventas' },
			{ name: 'AuditLogs', description: 'Registros de auditoría' },
			{ name: 'CashRegisters', description: 'Cajas registradoras' },
		],
	},
	apis: env.NODE_ENV === 'production' ? ['dist/**/*.js'] : ['src/**/*.ts'],
})
