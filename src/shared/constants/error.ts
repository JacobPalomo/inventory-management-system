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

	PRODUCT_ALREADY_EXISTS: {
		statusCode: 409,
		message: 'Ya existe un producto con ese identificador',
	},

	PRODUCT_ALREADY_DELETED: {
		statusCode: 409,
		message: 'El producto ya se encuentra eliminado',
	},

	PRODUCT_INSUFFICIENT_STOCK: {
		statusCode: 409,
		message: 'Stock insuficiente',
	},

	PRODUCT_DOES_NOT_TRACK_STOCK: {
		statusCode: 409,
		message: 'El producto no maneja inventario',
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

	// CASH_REGISTERS
	CASH_REGISTER_NOT_FOUND: {
		statusCode: 400,
		message: 'Caja registradora no encontrada ',
	},

	CASH_REGISTER_ALREADY_EXISTS: {
		statusCode: 409,
		message: 'Caja registradora ya existe con ese nombre',
	},

	CASH_REGISTER_IS_NOT_ACTIVE: {
		statusCode: 409,
		message: 'La caja registradora no se encuentra activa',
	},

	// GENERIC
	INVALID_QUERY_PARAMS: {
		statusCode: 400,
		message: 'Parámetros de consulta inválidos',
	},

	NO_BODY_ERROR: {
		statusCode: 400,
		message: 'Falta cuerpo de la solicitud',
	},

	INTERNAL_SERVER_ERROR: {
		statusCode: 500,
		message: 'Error interno del servidor',
	},
} as const
