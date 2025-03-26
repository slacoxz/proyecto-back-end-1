import express from 'express';
import {
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  addProductToCart,
  clearCart,
  getCart,
  getCarts
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/', getCarts);
router.get('/:cid', getCart);
router.post("/:cid/products/:pid", addProductToCart); // ✅ Asegurar que está bien colocado
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;
