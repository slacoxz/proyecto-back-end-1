import express from 'express';
import {
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  getCart
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/:cid', getCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;
