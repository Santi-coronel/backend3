import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from '../controllers/product.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// Rutas publicas: cualquiera puede ver el catalogo
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas: requieren estar autenticado. La verificacion de
// ownership (dueño del producto) o admin se resuelve en el service.
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.patch('/:id/status', auth, updateProductStatus);

// Solo admin puede eliminar productos directamente
router.delete('/:id', auth, authorize(ROLES.ADMIN), deleteProduct);

export default router;
