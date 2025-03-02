import Cart from '../models/cart.model.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
