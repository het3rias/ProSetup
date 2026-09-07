

// Lista de productos con la que arranca el sitio la primera vez.
// Si ya existen productos guardados en localStorage, no se pisan.
const productosIniciales = [
    { id: 1, nombre: "Teclado Mecánico RGB", precio: 45990, stock: 15, categoria: "Perifericos", imagen: "img/teclado.jpg" },
    { id: 2, nombre: "Mouse Gamer 16000 DPI", precio: 29990, stock: 20, categoria: "Perifericos", imagen: "img/mouse.jpg" },
    { id: 3, nombre: "Audífonos Gaming 7.1", precio: 38990, stock: 12, categoria: "Audio", imagen: "img/placeholder.png" },
    { id: 4, nombre: "Monitor Gamer 24\" 144Hz", precio: 149990, stock: 8, categoria: "Monitores", imagen: "img/placeholder.png" },
    { id: 5, nombre: "Mousepad XL RGB", precio: 14990, stock: 30, categoria: "Accesorios", imagen: "img/placeholder.png" },
    { id: 6, nombre: "Webcam Full HD 1080p", precio: 35990, stock: 14, categoria: "Accesorios", imagen: "img/placeholder.png" }
];

// Si es la primera vez que se abre el sitio, guardamos los productos base
function inicializarProductos() {
    if (!localStorage.getItem("productosDB")) {
        localStorage.setItem("productosDB", JSON.stringify(productosIniciales));
    }
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productosDB")) || [];
}

function guardarProductos(lista) {
    localStorage.setItem("productosDB", JSON.stringify(lista));
}

function obtenerProductoPorId(id) {
    return obtenerProductos().find(p => p.id === id);
}

// Dibuja tarjetas de producto dentro de un contenedor (usa Bootstrap "card")
function renderizarProductos(idContenedor, limite) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return; // esta página no tiene ese contenedor, no hacemos nada

    let productos = obtenerProductos();
    if (limite) {
        productos = productos.slice(0, limite);
    }

    let html = "";
    productos.forEach(prod => {
        html += `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card card-producto h-100">
                    <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}"
                         onerror="this.src='img/placeholder.png'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${prod.nombre}</h5>
                        <p class="precio">$${prod.precio.toLocaleString("es-CL")}</p>
                        <button class="btn btn-primary mt-auto mb-2" onclick="agregarAlCarrito(${prod.id})">
                            Añadir al Carrito
                        </button>
                        <a href="detalle-producto.html?id=${prod.id}" class="btn btn-outline-secondary">
                            Ver Detalle
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html || "<p>No hay productos para mostrar.</p>";
}

// Lee el ?id= de la URL y devuelve el número (o null si no viene)
function obtenerIdDeLaUrl() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    return id ? Number(id) : null;
}

// Pinta el detalle de un producto en detalle-producto.html
function renderizarDetalleProducto() {
    const contenedor = document.getElementById("detalle-producto");
    if (!contenedor) return;

    const id = obtenerIdDeLaUrl();
    const producto = obtenerProductoPorId(id);

    if (!producto) {
        contenedor.innerHTML = "<p>Producto no encontrado. <a href='productos.html'>Volver al catálogo</a></p>";
        return;
    }

    document.title = "ProSetup - " + producto.nombre;

    contenedor.innerHTML = `
        <div class="col-md-6">
            <img src="${producto.imagen}" class="img-fluid rounded" alt="${producto.nombre}"
                 onerror="this.src='img/placeholder.png'">
        </div>
        <div class="col-md-6">
            <h1>${producto.nombre}</h1>
            <p class="text-muted">Categoría: ${producto.categoria}</p>
            <p class="precio fs-3">$${producto.precio.toLocaleString("es-CL")}</p>
            <p>Stock disponible: ${producto.stock} unidades</p>
            <button class="btn btn-primary btn-lg" onclick="agregarAlCarrito(${producto.id})">
                Añadir al Carrito
            </button>
        </div>
    `;
}

/* ---------------- Carrito de compras ---------------- */

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carritoDB")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carritoDB", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert(producto.nombre + " fue agregado al carrito.");
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(item => item.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    item.cantidad += cambio;
    if (item.cantidad < 1) item.cantidad = 1;

    guardarCarrito(carrito);
    renderizarCarrito();
}

// Actualiza el número que aparece junto al ícono del carrito en el navbar
function actualizarContadorCarrito() {
    const contador = document.getElementById("cart-count");
    if (!contador) return;
    const carrito = obtenerCarrito();
    const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    contador.textContent = totalUnidades;
}

// Pinta la lista de productos del carrito en carrito.html
function renderizarCarrito() {
    const contenedor = document.getElementById("carrito-items");
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío. <a href='productos.html'>Ir al catálogo</a></p>";
        document.getElementById("carrito-total").textContent = "$0";
        return;
    }

    let html = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        html += `
            <div class="row align-items-center border-bottom py-3">
                <div class="col-2">
                    <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}"
                         onerror="this.src='img/placeholder.png'">
                </div>
                <div class="col-4">
                    <strong>${item.nombre}</strong><br>
                    <span class="text-muted">$${item.precio.toLocaleString("es-CL")} c/u</span>
                </div>
                <div class="col-3">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
                <div class="col-2 fw-bold">$${subtotal.toLocaleString("es-CL")}</div>
                <div class="col-1">
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">✕</button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
    document.getElementById("carrito-total").textContent = "$" + total.toLocaleString("es-CL");
}

function pagarCarrito() {
    alert("¡Gracias por tu compra! (esta es una simulación, no se procesa un pago real)");
    guardarCarrito([]);
    renderizarCarrito();
}

/* ---------------- Se ejecuta al cargar cualquier página ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    inicializarProductos();
    renderizarProductos("productos-destacados", 4); // index.html
    renderizarProductos("productos-catalogo");       // productos.html
    renderizarDetalleProducto();                     // detalle-producto.html
    renderizarCarrito();                             // carrito.html
    actualizarContadorCarrito();
});
