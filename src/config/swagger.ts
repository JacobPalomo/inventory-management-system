import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'
import { AuditAction, EntityType } from '@prisma/client'

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
							description: 'Valor antes del cambio (JSON dinámico)',
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
							type: 'string',
							enum: ['ADMIN', 'EDITOR', 'VIEWER'],
							example: 'ADMIN',
						},
						shiftId: {
							type: 'string',
							format: 'uuid',
							example: '53a05a32-2f73-45e3-aed5-a6dd2883d5e6',
						},
						createdAt: {
							type: 'string',
							format: 'ISODateTime',
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
							format: 'ISODateTime',
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
							format: 'JWTToken',
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
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '70278e02-6120-4785-a0bc-fb9b52c2aee9',
						},
						name: { type: 'string', example: 'Laptop HP' },
						description: { type: 'string', example: '16GB RAM' },
						stock: { type: 'number', example: 10 },
						minStock: { type: 'number', example: 3 },
						isActive: { type: 'boolean', example: true },
						createdAt: {
							type: 'string',
							format: 'ISODateTime',
							example: '2025-01-01T00:00:00Z',
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
						quantity: { type: 'number', example: 5 },
						createdAt: {
							type: 'string',
							format: 'ISODateTime',
							example: '2025-01-01T00:00:00Z',
						},
						product: {
							$ref: '#/components/schemas/Product',
						},
						user: {
							$ref: '#/components/schemas/User',
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
										$ref: '#/components/schemas/Product',
									},
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
		],
	},
	apis: env.NODE_ENV === 'production' ? ['dist/**/*.js'] : ['src/**/*.ts'],
})
