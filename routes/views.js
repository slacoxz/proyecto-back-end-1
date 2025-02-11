const express = require("express");
const router = express.Router();
const fs = require("fs");

const productsFilePath = "data/products.json"; // Ajusta la ruta si es diferente

// Ruta HOME
router.get("/home", (req, res) => {
    let products = [];

    // Leer productos desde el archivo JSON
    if (fs.existsSync(productsFilePath)) {
        const productsData = fs.readFileSync(productsFilePath, "utf-8");
        products = JSON.parse(productsData);
    }

    res.render("home", { products }); // Pasar productos a Handlebars
});

// Ruta Real-Time Products con WebSockets
router.get("/realtimeproducts", (req, res) => {
    let products = [];

    if (fs.existsSync(productsFilePath)) {
        const productsData = fs.readFileSync(productsFilePath, "utf-8");
        products = JSON.parse(productsData);
    }

    res.render("realTimeProducts", { products });
});

module.exports = router;
