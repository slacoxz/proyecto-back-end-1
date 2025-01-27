// routes/carts.js
[]

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const cartsFile = path.join(__dirname, '../data/carts.json');

// Helper para leer y escribir carritos
const readCarts = () => JSON.parse(fs.readFileSync(cartsFile, 'utf-8'));
const writeCarts = (carts) => fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: `${Date.now()}`,
    products: []
  };

  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === req.params.cid);

  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const cartIndex = carts.findIndex(c => c.id === req.params.cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCarts(carts);
  res.json(cart);
});

module.exports = router;