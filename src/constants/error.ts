export const ERROR_CODES = {
	// AUTH
	INVALID_CREDENTIALS: {
		statusCode: 401,
		message: 'Credenciales inválidas',
	},

	UNAUTHORIZED: {
		statusCode: 401,
		message: 'No autorizado',
	},

	FORBIDDEN: {
		statusCode: 403,
		message: 'Sin permisos',
	},

	// USERS
	USER_NOT_FOUND: {
		statusCode: 404,
		message: 'Usuario no encontrado',
	},

	USER_ALREADY_EXISTS: {
		statusCode: 400,
		message: 'El usuario ya existe',
	},

	USER_INVALID_CURRENT_PASSWORD: {
		statusCode: 400,
		message: 'La contraseña actual es incorrecta',
	},

	USER_SAME_PASSWORD: {
		statusCode: 400,
		message: 'La nueva contraseña es igual a la contraseña actual',
	},

	// PRODUCTS
	PRODUCT_NOT_FOUND: {
		statusCode: 404,
		message: 'Producto no encontrado',
	},

	PRODUCT_INSUFFICIENT_STOCK: {
		statusCode: 409,
		message: 'Stock insuficiente',
	},

	// SHIFTS
	SHIFT_NOT_FOUND: {
		statusCode: 404,
		message: 'Turno no encontrado',
	},

	SHIFT_OVERLAP: {
		statusCode: 400,
		message: 'El turno se solapa con otro existente',
	},

	// GENERIC
	INTERNAL_SERVER_ERROR: {
		statusCode: 500,
		message: 'Error interno del servidor',
	},
} as const
