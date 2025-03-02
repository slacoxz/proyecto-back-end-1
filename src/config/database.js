import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 Conectado a MongoDB');
  } catch (error) {
    console.error('🔴 Error de conexión:', error);
    process.exit(1);
  }
};

export default connectDB;
