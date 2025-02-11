const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productsFilePath = "data/products.json"; // Ruta al archivo JSON

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas de vistas
const viewsRouter = require("./routes/views");
app.use('/', viewsRouter);

// ---- WebSockets ----
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Enviar lista inicial de productos
    if (fs.existsSync(productsFilePath)) {
        const productsData = fs.readFileSync(productsFilePath, "utf-8");
        const products = JSON.parse(productsData);
        socket.emit("updateProducts", products);
    }

    // Agregar producto
    socket.on("addProduct", (product) => {
        let products = [];
        if (fs.existsSync(productsFilePath)) {
            const productsData = fs.readFileSync(productsFilePath, "utf-8");
            products = JSON.parse(productsData);
        }

        // Agregar nuevo producto con ID único
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title: product.title,
            price: product.price,
            stock: product.stock
        };
        products.push(newProduct);

        // Guardar en archivo JSON
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

        // Emitir actualización a todos los clientes
        io.emit("updateProducts", products);
    });

    // Eliminar producto
    socket.on("deleteProduct", (id) => {
        if (fs.existsSync(productsFilePath)) {
            let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
            products = products.filter(product => product.id !== id);

            // Guardar en archivo JSON
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

            // Emitir actualización
            io.emit("updateProducts", products);
        }
    });
});

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
