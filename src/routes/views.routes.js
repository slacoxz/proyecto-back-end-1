import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('home'); // Asegúrate de tener una vista llamada "home.handlebars"
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('products', { products });
  } catch (error) {
    res.status(500).render('error', { message: 'Error al obtener productos' });
  }
});

router.get('/cart', (req, res) => {
  res.render('cart'); // Asegúrate de tener "cart.handlebars"
});

export default router;
