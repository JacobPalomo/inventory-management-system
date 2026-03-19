import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Route imports
import authRoutes from './modules/auth/auth.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes config
app.use('/api/auth', authRoutes)

app.get('/', (_req, res) => {
	res.send('API running 🚀')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
