import { Express } from 'express'
import fs from 'fs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../config/swagger'

export const setupDocs = (app: Express) => {
	const templatePath = path.join(__dirname, 'redoc.html')
	// Swagger JSON
	app.get('/swagger.json', (_, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	// Swagger UI (para dev)
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	// Redoc (para presentación)
	app.get('/docs', (req, res) => {
		const html = fs.readFileSync(templatePath, 'utf-8')

		const specUrl = `${req.protocol}://${req.get('host')}/swagger.json`

		const finalHtml = html.replace('__SPEC_URL__', specUrl)
		res.send(finalHtml)
	})
}
