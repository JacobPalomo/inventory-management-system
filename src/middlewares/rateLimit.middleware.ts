import rateLimit from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => {
		return req.ip || req.socket.remoteAddress || 'unknown'
	},
	message: {
		message: 'Demasiadas solicitudes',
	},
})

export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 min
	max: 5,
	skipSuccessfulRequests: true,
	message: {
		message: 'Demasiados intentos de inicio de sesión',
	},
})

export const movementRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 20,
	message: {
		message: 'Too many inventory operations',
	},
})
