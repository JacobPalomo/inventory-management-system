import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { globalRateLimiter } from './middlewares/rateLimit.middleware'
import { setupDocs } from './docs'
import { errorMiddleware } from './middlewares/error.middleware'

// Route imports
import authRoutes from './modules/auth/auth.routes'
import usersRoutes from './modules/users/user.routes'
import shiftsRoutes from './modules/shifts/shift.routes'
import productsRoutes from './modules/products/product.routes'
import movementsRoutes from './modules/movements/movement.routes'

const app = express()

app.use(cors())
app.use(express.json())

// Logging
app.use(
	morgan('dev', {
		skip: req => req.originalUrl.startsWith('/api/docs'),
	}),
)

// Rate limit
app.set('trust proxy', 1)
app.use(globalRateLimiter)

// Documentation config
setupDocs(app)

// Routes config
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/shifts', shiftsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/movements', movementsRoutes)

app.get('/', (_req, res) => {
	res.send('API running 🚀')
})

// Error Management
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
