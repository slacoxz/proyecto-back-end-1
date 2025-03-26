import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import viewsRoutes from './routes/views.routes.js'; // Asegúrate de importar las rutas de vistas correctamente

dotenv.config();
connectDB();

const app = express();

// 📌 Configuración de Handlebars
const hbs = create({ extname: '.handlebars' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// 📌 Definir correctamente la carpeta de vistas
const viewsPath = path.join(path.resolve(), 'src/views');
console.log('🛠 Ruta absoluta de views:', viewsPath);
app.set('views', viewsPath);

// 📌 Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Definir rutas
app.use('/', viewsRoutes); // Montar las rutas de vistas en la raíz
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// 📌 Ruta de fallback para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

export default app;
