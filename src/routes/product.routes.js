import { Router } from 'express';
import { renderProducts, renderProductDetail, getProducts } from '../controllers/product.controller.js';

const router = Router();

router.get("/", renderProducts); // Página con lista de productos
router.get("/json", getProducts); // API JSON de productos
router.get("/:id", renderProductDetail); // Página de detalle de un producto

export default router;
