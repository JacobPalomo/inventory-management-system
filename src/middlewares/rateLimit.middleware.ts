import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => ipKeyGenerator(req.ip ?? 'unknown'),
	message: {
		code: 'TOO_MANY_REQUESTS',
		message: 'Demasiadas solicitudes',
	},
})

export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 min
	max: 5,
	// skipSuccessfulRequests: true,
	message: {
		code: 'TOO_MANY_REQUESTS',
		message: 'Demasiados intentos de inicio de sesión',
	},
})

export const movementRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1min
	max: 20,
	message: {
		code: 'TOO_MANY_REQUESTS',
		message: 'Demasiadas operaciones de inventario',
	},
})
