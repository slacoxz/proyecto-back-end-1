const express = require("express");

const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
