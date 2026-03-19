import rateLimit from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		message: 'Demasiadas solicitudes',
	},
})

export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 min
	max: 5,
	message: {
		message: 'Demasiados intentos de inicio de sesión',
	},
})
