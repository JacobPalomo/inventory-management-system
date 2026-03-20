import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import { errorMiddleware } from './middlewares/error.middleware'
import { globalRateLimiter } from './middlewares/rateLimit.middleware'

// Route imports
import authRoutes from './modules/auth/auth.routes'
import productsRoutes from './modules/products/product.routes'
import movementsRoutes from './modules/movements/movement.routes'

const app = express()

app.use(cors())
app.use(express.json())

// Logging & Error Management config
app.use(errorMiddleware)
app.use(
	morgan('dev', {
		skip: req => req.originalUrl.startsWith('/api/docs'),
	}),
)

// Rate limit
app.set('trust proxy', 1)
app.use(globalRateLimiter)

// Swagger Documentation config
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes config
app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/movements', movementsRoutes)

app.get('/', (_req, res) => {
	res.send('API running 🚀')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
