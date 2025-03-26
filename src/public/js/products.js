document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", async (event) => {
            const pid = event.target.dataset.pid; // ID del producto
            let cid = localStorage.getItem("cartId"); // Recuperar carrito desde localStorage

            if (!cid) {
                alert("No tienes un carrito asignado. Crea uno primero.");
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: 1 })
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Producto agregado al carrito");
                } else {
                    alert("Error: " + result.message);
                }
            } catch (error) {
                console.error("Error al agregar producto:", error);
            }
        });
    });
});
