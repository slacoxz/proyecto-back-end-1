const express = require('express');
const fs = require('fs');
const router = express.Router();
const { io } = require('../server');

// Ruta para agregar un producto
router.post('/', (req, res) => {
  const { title, price } = req.body;
  const productsPath = './data/products.json';
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    title,
    price,
  };

  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

  // Emitir evento a WebSocket
  io.emit('update-products', products);

  res.status(201).send(newProduct);
});

// Ruta para eliminar un producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const productsPath = './data/products.json';
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  const updatedProducts = products.filter((product) => product.id != id);
  fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

  // Emitir evento a WebSocket
  io.emit('update-products', updatedProducts);

  res.status(200).send({ message: `Producto con id ${id} eliminado` });
});

module.exports = router;
