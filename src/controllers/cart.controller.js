import Cart from '../models/cart.model.js'; // Asegúrate de importar tu modelo de carrito
import Product from '../models/product.model.js'; // Asegúrate de importar el modelo de productos si es necesario

// Obtener todos los carritos
export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find(); // Obtener todos los carritos de la base de datos
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos', error });
  }
};

// Obtener un carrito por ID
export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    res.render("cart", { cart: cart.products });
  } catch (error) {
    console.error("❌ Error al obtener el carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    console.log("📦 Agregando producto al carrito:", { cid, pid, quantity });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Asegurar que la cantidad sea un número válido
    quantity = quantity ? parseInt(quantity) : 1;
    if (isNaN(quantity) || quantity <= 0) quantity = 1;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity; // Incrementar cantidad
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    console.log("✅ Producto agregado al carrito", cart);
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    console.error("🔥 Error en addProductToCart:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// Actualizar un carrito (Reemplazar su contenido)
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // Enviar un array de productos con ID y cantidad

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = products; // Reemplazar productos en el carrito
    await cart.save();

    res.json({ message: 'Carrito actualizado', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ message: 'Cantidad de producto actualizada', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cantidad', error });
  }
};

// Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
  }
};

// Vaciar un carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ message: 'Carrito vaciado', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito', error });
  }
};
