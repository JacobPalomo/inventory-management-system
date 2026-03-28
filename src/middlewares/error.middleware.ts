import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	// ⚠️ SI YA RESPONDISTE → SALIR
	if (res.headersSent) {
		return
	}

	// ZOD
	if (err.name === 'ZodError') {
		return res.status(400).json({
			code: 'VALIDATION_ERROR',
			message: 'Error de validación',
			details: JSON.parse(err.message).map((error: any) => ({
				field: error.path[0],
				message: error.message,
			})),
		})
	}

	// APP ERROR
	if (err.statusCode) {
		return res.status(err.statusCode).json({
			code: err.code || 'BAD_REQUEST',
			message: err.message,
		})
	}

	// FALLBACK
	console.error(err)

	return res.status(500).json({
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Error interno del servidor',
	})
}
