import { Router } from 'express'
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
} from './product.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorizeRoles } from '../../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/', authorizeRoles('ADMIN', 'EDITOR'), createProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', authorizeRoles('ADMIN', 'EDITOR'), updateProduct)
router.delete('/:id', authorizeRoles('ADMIN'), deleteProduct)

export default router
