const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const PORT = 8080;

// Configurar Handlebars
const hbs = create({
  extname: '.handlebars',
});
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar Socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Escucha y emite eventos
  socket.on('new-product', (data) => {
    io.emit('update-products', data);
  });

  socket.on('delete-product', (data) => {
    io.emit('update-products', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

module.exports = { app, io };
