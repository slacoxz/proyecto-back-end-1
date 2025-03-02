import Product from '../models/product.model.js';

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    let filter = {};
    if (query) {
      filter = { category: query };  
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const result = await Product.paginate(filter, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
