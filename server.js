// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
