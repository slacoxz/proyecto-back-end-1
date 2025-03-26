import Product from '../models/product.model.js';

// 📌 Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: '✅ Producto agregado con éxito', product });
  } catch (error) {
    console.error('❌ Error en createProduct:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 📌 Obtener productos en formato JSON (API)
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = { category: query };  
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true, // Importante para Handlebars
    };

    const result = await Product.paginate(filter, options);

    res.status(200).json({
      status: 'success',
      message: '✅ Productos obtenidos correctamente',
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error('❌ Error en getProducts:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 📌 Renderizar productos en Handlebars
export const renderProducts = async (req, res) => {
  try {
    console.log('🔄 Ejecutando renderProducts()...'); 

    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = { category: query };
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    console.log(`✅ ${result.docs.length} productos obtenidos para renderizar`);

    res.render('products', { products: result.docs });
  } catch (error) {
    console.error('❌ Error en renderProducts:', error.message);
    res.status(500).render('error', { message: 'Hubo un problema al cargar los productos.' });
  }
};

// 📌 Renderizar detalles del producto en Handlebars
export const renderProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔎 Buscando producto con ID: ${id}`);

    const product = await Product.findById(id).lean();
    if (!product) {
      console.warn(`⚠️ Producto con ID ${id} no encontrado`);
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }

    res.render('productDetail', { product });
  } catch (error) {
    console.error('❌ Error en renderProductDetail:', error.message);
    res.status(500).render('error', { message: 'Hubo un problema al cargar el producto.' });
  }
};
