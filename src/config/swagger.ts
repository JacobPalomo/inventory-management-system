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
				// 🔐 USER
				User: {
					type: 'object',
					properties: {
						id: { type: 'string', example: 'uuid-user' },
						name: { type: 'string', example: 'Jacob' },
						email: { type: 'string', example: 'jacob@test.com' },
						role: {
							type: 'string',
							enum: ['ADMIN', 'EDITOR', 'VIEWER'],
						},
					},
				},

				// 🔐 AUTH RESPONSE
				AuthResponse: {
					type: 'object',
					properties: {
						token: {
							type: 'string',
							example: 'jwt.token.here',
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
						id: { type: 'string', example: 'uuid-product' },
						name: { type: 'string', example: 'Laptop HP' },
						description: { type: 'string', example: '16GB RAM' },
						stock: { type: 'number', example: 10 },
						minStock: { type: 'number', example: 3 },
						isActive: { type: 'boolean', example: true },
						createdAt: {
							type: 'string',
							example: '2025-01-01T00:00:00Z',
						},
					},
				},

				// 🔄 MOVEMENT
				Movement: {
					type: 'object',
					properties: {
						id: { type: 'string', example: 'uuid-movement' },
						type: {
							type: 'string',
							enum: ['IN', 'OUT'],
						},
						quantity: { type: 'number', example: 5 },
						createdAt: {
							type: 'string',
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

				// ❌ ERROR
				Error: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							example: 'Error message',
						},
					},
				},
			},

			responses: {
				UnauthorizedError: {
					description: 'No autorizado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
						},
					},
				},

				InvalidCredentialsError: {
					description: 'Credenciales inválidas',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
						},
					},
				},

				InvalidBodyError: {
					description: 'Datos inválidos',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
						},
					},
				},

				ToManyRequestsError: {
					description: 'Demasiadas solicitudes',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
						},
					},
				},

				UserExistsError: {
					description: 'Usuario existente',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
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
						},
					},
				},

				NotFoundError: {
					description: 'Recurso no encontrado',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Error',
							},
						},
					},
				},
			},
		},
	},
	tags: [
		{ name: 'Auth', description: 'Autenticación' },
		{ name: 'Products', description: 'Gestión de productos' },
		{ name: 'Movements', description: 'Movimientos de inventario' },
	],
	apis: env.NODE_ENV === 'production' ? ['dist/**/*.js'] : ['src/**/*.ts'],
})
