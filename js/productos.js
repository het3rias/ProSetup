// Arreglo inicial con los 12 productos del catálogo
const productosIniciales = [
  { id: 1, codigo: "KEY-001", nombre: "Teclado Mecánico RGB Switch Red", precio: 45990, stock: 15, categoria: "Periféricos", imagen: "img/teclado.jpg" },
  { id: 2, codigo: "MOU-002", nombre: "Mouse Gamer Ultra Ligero 16000 DPI", precio: 29990, stock: 20, categoria: "Periféricos", imagen: "img/mouse.jpg" },
  { id: 3, codigo: "AUD-003", nombre: "Audífonos Gaming 7.1 Surround", precio: 38990, stock: 12, categoria: "Audio", imagen: "img/audifonos.jpg" },
  { id: 4, codigo: "MON-004", nombre: "Monitor Gamer 24\" 144Hz 1ms", precio: 149990, stock: 8, categoria: "Monitores", imagen: "img/monitor.jpg" },
  { id: 5, codigo: "SIL-005", nombre: "Silla Gamer Ergonómica Reclinable", precio: 129990, stock: 5, categoria: "Mobiliario", imagen: "img/silla.jpg" },
  { id: 6, codigo: "PAD-006", nombre: "Mousepad XL RGB Antideslizante", precio: 14990, stock: 30, categoria: "Accesorios", imagen: "img/mousepad.jpg" },
  { id: 7, codigo: "MIC-007", nombre: "Micrófono Condensador USB Streamer", precio: 42990, stock: 10, categoria: "Audio", imagen: "img/microfono.jpg" },
  { id: 8, codigo: "CAM-008", nombre: "Webcam Full HD 1080p 60fps", precio: 35990, stock: 14, categoria: "Accesorios", imagen: "img/webcam.jpg" },
  { id: 9, codigo: "GAB-009", nombre: "Gabinete ATX Cristal Templado RGB", precio: 59990, stock: 6, categoria: "Componentes", imagen: "img/gabinete.jpg" },
  { id: 10, codigo: "SOP-010", nombre: "Soporte Doble para Monitores 17-32\"", precio: 24990, stock: 18, categoria: "Accesorios", imagen: "img/soporte.jpg" },
  { id: 11, codigo: "LUM-011", nombre: "Barra de Luz LED para Monitor RGB", precio: 19990, stock: 25, categoria: "Iluminación", imagen: "img/barraluz.jpg" },
  { id: 12, codigo: "BAR-012", nombre: "Barra de Sonido Gamer Bluetooth", precio: 32990, stock: 9, categoria: "Audio", imagen: "img/parlante.jpg" }
];

// Inicializar LocalStorage si no existen los datos
function inicializarBaseDeDatos() {
    if (!localStorage.getItem('productosDB')) {
        localStorage.setItem('productosDB', JSON.stringify(productosIniciales));
    }
}

// Obtener productos desde LocalStorage
function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productosDB')) || productosIniciales;
}

// Cargar catálogo en productos.html o destacados en index.html
function renderizarProductos(contenedorId, limite = null) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    let lista = obtenerProductos();
    if (limite) {
        lista = lista.slice(0, limite);
    }

    contenedor.innerHTML = '';
    lista.forEach(prod => {
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/250x180?text=PROSETUP'">
                <h3>${prod.nombre}</h3>
                <p class="price">$${prod.precio.toLocaleString('es-CL')}</p>
                <button class="btn-primary" onclick="agregarAlCarrito(${prod.id})">Añadir al Carrito</button>
                <a href="detalle-producto.html?id=${prod.id}" class="btn-secondary">Ver Detalle</a>
            </div>
        `;
    });
}

// Función para agregar al carrito
function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = obtenerProductos().find(p => p.id === id);

    if (producto) {
        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert(`${producto.nombre} agregado al carrito.`);
    }
}

// Actualizar el número del carrito en el header
function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Ejecutar al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    inicializarBaseDeDatos();
    renderizarProductos('contenedor-productos'); // Para productos.html
    renderizarProductos('destacados-container', 4); // Para index.html (4 destacados)
    actualizarContadorCarrito();
});