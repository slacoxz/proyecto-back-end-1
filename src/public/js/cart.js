// 📌 Eliminar un producto del carrito
function removeFromCart(productId) {
    fetch(`/api/carts/ID_DEL_CARRITO/product/${productId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
        alert("Producto eliminado");
        location.reload(); // Recargar la página para actualizar la vista
    })
    .catch(error => console.error("Error:", error));
}

// 📌 Vaciar el carrito
function emptyCart() {
    fetch(`/api/carts/ID_DEL_CARRITO`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
        alert("Carrito vaciado");
        location.reload();
    })
    .catch(error => console.error("Error:", error));
}

// 📌 Finalizar la compra
function finalizePurchase() {
    fetch(`/api/carts/ID_DEL_CARRITO/purchase`, { method: "POST" })
    .then(response => response.json())
    .then(data => {
        alert("Compra realizada con éxito");
        location.href = "/products"; // Redirigir a la tienda
    })
    .catch(error => console.error("Error:", error));
}
