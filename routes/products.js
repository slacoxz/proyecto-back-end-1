const express = require("express");
const fs = require("fs");
const router = express.Router();

const productsFilePath = "./data/products.json";

// Función para leer los productos desde el archivo
const readProducts = () => {
  if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, JSON.stringify([])); // Si no existe, lo crea
  }
  const data = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(data);
};

// Ruta GET: Obtener todos los productos
router.get("/", (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Ruta GET: Obtener un producto por su ID
router.get("/:id", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// Ruta POST: Agregar un nuevo producto
router.post("/", (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1, // ID autogenerado
    ...req.body,
  };

  products.push(newProduct);
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2)); // Guardar en archivo
  res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
});

module.exports = router;
