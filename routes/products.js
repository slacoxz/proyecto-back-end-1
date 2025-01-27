// routes/products.js
[]

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productsFile = path.join(__dirname, '../data/products.json');

// Helper para leer y escribir productos
const readProducts = () => JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const writeProducts = (products) => fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

// Listar todos los productos con ?limit
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = parseInt(req.query.limit);
  res.json(limit ? products.slice(0, limit) : products);
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
    const products = readProducts(); // Leer productos desde el archivo
    const productId = parseInt(req.params.pid); // Convertir el parámetro a número
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
});

// Crear nuevo producto
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: `${Date.now()}`,
    ...req.body,
    status: req.body.status !== undefined ? req.body.status : true
  };

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Actualizar producto
router.put('/:pid', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[index], ...req.body };
  delete updatedProduct.id; // No permitir modificar el ID
  products[index] = updatedProduct;
  writeProducts(products);

  res.json(updatedProduct);
});

// Eliminar producto
router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== req.params.pid);

  if (products.length === filteredProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  writeProducts(filteredProducts);
  res.status(204).send();
});

module.exports = router;