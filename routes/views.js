const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta para la vista "home"
router.get('/home', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
  res.render('home', { products });
});

// Ruta para la vista "realTimeProducts"
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;
