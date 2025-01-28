const express = require("express");
const fs = require("fs");
const router = express.Router();

const cartsFilePath = "./data/carts.json";
const productsFilePath = "./data/products.json";

// Función para leer los carritos
const readCarts = () => {
  if (!fs.existsSync(cartsFilePath)) {
    fs.writeFileSync(cartsFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
};

// Función para guardar los carritos
const saveCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Ruta GET: Obtener todos los carritos
router.get("/", (req, res) => {
  const carts = readCarts();
  res.json(carts);
});

// Ruta POST: Crear un nuevo carrito
router.post("/", (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1, // ID autogenerado
    products: [],
  };
  carts.push(newCart);
  saveCarts(carts);
  res.status(201).json({ message: "Carrito creado con éxito", cart: newCart });
});

// Ruta GET: Obtener los productos de un carrito específico
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const carts = readCarts();
  const cart = carts.find((cart) => cart.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// Ruta POST: Agregar un producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;

  const carts = readCarts();
  const cart = carts.find((cart) => cart.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  const product = products.find((product) => product.id === parseInt(pid));

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const existingProduct = cart.products.find(
    (p) => p.product === parseInt(pid)
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: parseInt(pid), quantity: 1 });
  }

  saveCarts(carts);
  res.json({ message: "Producto agregado al carrito", cart });
});


module.exports = router;
