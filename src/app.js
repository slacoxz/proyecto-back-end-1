import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

export default app;
