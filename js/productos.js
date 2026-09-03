const productosIniciales = [
  { id: 1, codigo: "KEY-001", nombre: "Teclado Mecánico RGB Switch Red", precio: 45990, stock: 15, categoria: "Periféricos", imagen: "img/teclado.jpg", descripcion: "Teclado mecánico con switches Red de recorrido suave, ideal para gaming y escritura rápida. Iluminación RGB personalizable tecla por tecla y estructura resistente para uso intensivo." },
  { id: 2, codigo: "MOU-002", nombre: "Mouse Gamer Ultra Ligero 16000 DPI", precio: 29990, stock: 20, categoria: "Periféricos", imagen: "img/mouse.jpg", descripcion: "Mouse gamer de diseño ultraligero con sensor de hasta 16000 DPI ajustables, botones laterales programables y cable flexible para movimientos precisos en cualquier juego." },
  { id: 3, codigo: "AUD-003", nombre: "Audífonos Gaming 7.1 Surround", precio: 38990, stock: 12, categoria: "Audio", imagen: "img/audifonos.jpg", descripcion: "Audífonos con sonido envolvente 7.1 virtual, micrófono con cancelación de ruido y almohadillas acolchadas pensadas para sesiones largas de juego o streaming." },
  { id: 4, codigo: "MON-004", nombre: "Monitor Gamer 24\" 144Hz 1ms", precio: 149990, stock: 8, categoria: "Monitores", imagen: "img/monitor.jpg", descripcion: "Monitor de 24 pulgadas con panel de 144Hz y 1ms de respuesta, perfecto para juegos competitivos donde cada milisegundo cuenta. Incluye entradas HDMI y DisplayPort." },
  { id: 5, codigo: "SIL-005", nombre: "Silla Gamer Ergonómica Reclinable", precio: 129990, stock: 5, categoria: "Mobiliario", imagen: "img/silla.jpg", descripcion: "Silla ergonómica con respaldo reclinable, soporte lumbar ajustable y reposabrazos 4D, diseñada para mantener una postura correcta durante largas jornadas frente al computador." },
  { id: 6, codigo: "PAD-006", nombre: "Mousepad XL RGB Antideslizante", precio: 14990, stock: 30, categoria: "Accesorios", imagen: "img/mousepad.jpg", descripcion: "Mousepad extendido con base antideslizante e iluminación RGB perimetral, cubre teclado y mouse para una superficie de juego uniforme." },
  { id: 7, codigo: "MIC-007", nombre: "Micrófono Condensador USB Streamer", precio: 42990, stock: 10, categoria: "Audio", imagen: "img/microfono.jpg", descripcion: "Micrófono de condensador con conexión USB plug and play, ideal para streaming, podcasts y videollamadas gracias a su captación de voz clara y nítida." },
  { id: 8, codigo: "CAM-008", nombre: "Webcam Full HD 1080p 60fps", precio: 35990, stock: 14, categoria: "Accesorios", imagen: "img/webcam.jpg", descripcion: "Webcam Full HD 1080p a 60fps con enfoque automático y micrófono integrado, pensada para streaming y videollamadas con la mejor calidad de imagen." },
  { id: 9, codigo: "GAB-009", nombre: "Gabinete ATX Cristal Templado RGB", precio: 59990, stock: 6, categoria: "Componentes", imagen: "img/gabinete.jpg", descripcion: "Gabinete ATX con panel lateral de cristal templado, ventiladores RGB incluidos y amplio espacio interno para organizar el cableado y mejorar la refrigeración." },
  { id: 10, codigo: "SOP-010", nombre: "Soporte Doble para Monitores 17-32\"", precio: 24990, stock: 18, categoria: "Accesorios", imagen: "img/soporte.jpg", descripcion: "Soporte de escritorio para dos monitores de 17 a 32 pulgadas, con brazos articulados que permiten ajustar altura, inclinación y rotación para un setup más cómodo." },
  { id: 11, codigo: "LUM-011", nombre: "Barra de Luz LED para Monitor RGB", precio: 19990, stock: 25, categoria: "Iluminación", imagen: "img/barraluz.jpg", descripcion: "Barra de luz LED que se instala sobre el monitor para iluminar el espacio de trabajo sin generar reflejos en la pantalla, con control de brillo y temperatura de color." },
  { id: 12, codigo: "BAR-012", nombre: "Barra de Sonido Gamer Bluetooth", precio: 32990, stock: 9, categoria: "Audio", imagen: "img/parlante.jpg", descripcion: "Barra de sonido compacta con conexión Bluetooth y entrada auxiliar, graves potentes e iluminación RGB para acompañar tu setup gamer." }
];


function inicializarBaseDeDatos() {
    if (!localStorage.getItem('productosDB')) {
        localStorage.setItem('productosDB', JSON.stringify(productosIniciales));
    }
}


function obtenerProductos() {
    try {
        const datos = localStorage.getItem('productosDB');
        return datos ? JSON.parse(datos) : productosIniciales;
    } catch (e) {
        return productosIniciales;
    }
}


// Evita que nombres con comillas, < o & rompan el HTML (ej: 'Monitor 24" 144Hz')
function escaparHTML(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Colores por categoría para las imágenes de reemplazo
const PALETA_CATEGORIAS = {
    "Periféricos": ["#00F0FF", "#7000FF"],
    "Audio": ["#FF3DAE", "#7000FF"],
    "Monitores": ["#00F0FF", "#0090FF"],
    "Mobiliario": ["#FFB800", "#FF5E3A"],
    "Accesorios": ["#00FFB2", "#00F0FF"],
    "Componentes": ["#7000FF", "#FF3DAE"],
    "Iluminación": ["#FFD400", "#FF8A00"]
};

// Genera una imagen SVG (en memoria, sin depender de internet) con las
// iniciales del producto y el color de su categoría, para usar cuando
// no exista una foto real en /img.
function generarPlaceholder(nombre, categoria) {
    const [c1, c2] = PALETA_CATEGORIAS[categoria] || ["#00F0FF", "#7000FF"];
    const iniciales = escaparHTML(
        (nombre || 'PS').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
    );
    const categoriaTxt = escaparHTML(categoria || 'ProSetup');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="${c2}" stop-opacity="0.35"/>
            </linearGradient>
        </defs>
        <rect width="400" height="300" fill="#161925"/>
        <rect width="400" height="300" fill="url(#g)"/>
        <circle cx="200" cy="115" r="55" fill="none" stroke="${c1}" stroke-width="2" opacity="0.7"/>
        <text x="200" y="130" font-family="Segoe UI, Verdana, sans-serif" font-size="40" font-weight="bold" fill="${c1}" text-anchor="middle">${iniciales}</text>
        <text x="200" y="215" font-family="Segoe UI, Verdana, sans-serif" font-size="15" fill="#a0a5c0" text-anchor="middle">${categoriaTxt}</text>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// Se llama desde el atributo onerror de cada <img> cuando la foto real no existe
function mostrarPlaceholder(imgEl) {
    imgEl.onerror = null; // evita loops si el placeholder también fallara
    imgEl.src = generarPlaceholder(imgEl.dataset.nombre, imgEl.dataset.categoria);
}

function renderizarProductos(contenedorId, limite = null, listaPersonalizada = null) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return; // Si el ID no existe en la página actual, ignora la ejecución

    let lista = listaPersonalizada || obtenerProductos();
    if (limite) {
        lista = lista.slice(0, limite);
    }

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }

    let htmlContenido = '';
    lista.forEach(prod => {
        const nombreSeguro = escaparHTML(prod.nombre);
        const categoriaSegura = escaparHTML(prod.categoria);
        htmlContenido += `
            <div class="product-card">
                <img src="${prod.imagen}" alt="${nombreSeguro}" data-nombre="${nombreSeguro}" data-categoria="${categoriaSegura}" onerror="mostrarPlaceholder(this)">
                <h3>${nombreSeguro}</h3>
                <p class="price">$${prod.precio.toLocaleString('es-CL')}</p>
                <button type="button" class="btn-primary" onclick="agregarAlCarrito(${prod.id})">Añadir al Carrito</button>
                <a href="detalle-producto.html?id=${prod.id}" class="btn-secondary">Ver Detalle</a>
            </div>
        `;
    });

    contenedor.innerHTML = htmlContenido;
}

// Llena el <select> de categorías con las categorías reales de la "BD"
function poblarFiltroCategorias() {
    const select = document.getElementById('filtro-categoria');
    if (!select) return;

    const categorias = [...new Set(obtenerProductos().map(p => p.categoria))].sort();
    let opciones = '<option value="todas">Todas las categorías</option>';
    categorias.forEach(cat => {
        opciones += `<option value="${cat}">${cat}</option>`;
    });
    select.innerHTML = opciones;
}

// Aplica búsqueda + filtro de categoría + orden sobre la lista completa de productos
function obtenerProductosFiltrados() {
    const searchInput = document.getElementById('buscador-productos');
    const categoriaSelect = document.getElementById('filtro-categoria');
    const ordenSelect = document.getElementById('filtro-orden');

    let lista = obtenerProductos();

    if (searchInput && searchInput.value.trim() !== '') {
        const termino = searchInput.value.trim().toLowerCase();
        lista = lista.filter(p =>
            p.nombre.toLowerCase().includes(termino) ||
            p.codigo.toLowerCase().includes(termino)
        );
    }

    if (categoriaSelect && categoriaSelect.value !== 'todas') {
        lista = lista.filter(p => p.categoria === categoriaSelect.value);
    }

    if (ordenSelect) {
        if (ordenSelect.value === 'precio-asc') lista = [...lista].sort((a, b) => a.precio - b.precio);
        if (ordenSelect.value === 'precio-desc') lista = [...lista].sort((a, b) => b.precio - a.precio);
        if (ordenSelect.value === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return lista;
}

// Vuelve a pintar el catálogo (productos.html) según los filtros activos
function actualizarCatalogo() {
    renderizarProductos('contenedor-productos', null, obtenerProductosFiltrados());
}

// Resetea buscador, categoría y orden, y vuelve a pintar el catálogo completo
function limpiarFiltros() {
    const searchInput = document.getElementById('buscador-productos');
    const categoriaSelect = document.getElementById('filtro-categoria');
    const ordenSelect = document.getElementById('filtro-orden');

    if (searchInput) searchInput.value = '';
    if (categoriaSelect) categoriaSelect.value = 'todas';
    if (ordenSelect) ordenSelect.value = 'relevancia';

    actualizarCatalogo();
}

// Busca un producto por su id (usado en detalle-producto.html)
function obtenerProductoPorId(id) {
    return obtenerProductos().find(p => p.id === id);
}

// Pinta la ficha completa de un producto en detalle-producto.html,
// leyendo el id desde ?id= en la URL.
function renderizarDetalleProducto() {
    const contenedor = document.getElementById('detalle-producto');
    if (!contenedor) return; // No estamos en detalle-producto.html

    const relSection = document.getElementById('relacionados-section');
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    const producto = obtenerProductoPorId(id);

    if (!producto) {
        contenedor.innerHTML = `
            <div class="detalle-no-encontrado">
                <h2>Producto no encontrado</h2>
                <p>El producto que buscas no existe o fue eliminado.</p>
                <a href="productos.html" class="btn-primary">Volver al catálogo</a>
            </div>
        `;
        if (relSection) relSection.style.display = 'none';
        return;
    }

    document.title = `ProSetup - ${producto.nombre}`;

    const nombreSeguro = escaparHTML(producto.nombre);
    const categoriaSegura = escaparHTML(producto.categoria);
    const codigoSeguro = escaparHTML(producto.codigo);
    const descripcionSegura = escaparHTML(producto.descripcion || 'Sin descripción disponible por el momento.');
    const sinStock = producto.stock <= 0;

    contenedor.innerHTML = `
        <div class="detalle-imagen">
            <img src="${producto.imagen}" alt="${nombreSeguro}" data-nombre="${nombreSeguro}" data-categoria="${categoriaSegura}" onerror="mostrarPlaceholder(this)">
        </div>
        <div class="detalle-info">
            <span class="detalle-categoria">${categoriaSegura}</span>
            <h1>${nombreSeguro}</h1>
            <p class="detalle-codigo">Código: ${codigoSeguro}</p>
            <p class="detalle-precio">$${producto.precio.toLocaleString('es-CL')}</p>
            <p class="detalle-stock ${sinStock ? 'sin-stock' : ''}">
                ${sinStock ? 'Sin stock disponible' : `Stock disponible: ${producto.stock} unidades`}
            </p>
            <p class="detalle-descripcion">${descripcionSegura}</p>

            <div class="detalle-acciones">
                <label for="detalle-cantidad">Cantidad</label>
                <input type="number" id="detalle-cantidad" min="1" max="${Math.max(producto.stock, 1)}" value="1" ${sinStock ? 'disabled' : ''}>
                <button type="button" class="btn-primary" id="btn-agregar-detalle" ${sinStock ? 'disabled' : ''}>
                    ${sinStock ? 'Sin stock' : 'Añadir al Carrito'}
                </button>
            </div>

            <a href="productos.html" class="detalle-volver">&larr; Volver al catálogo</a>
        </div>
    `;

    const breadcrumbActual = document.getElementById('breadcrumb-actual');
    if (breadcrumbActual) breadcrumbActual.textContent = producto.nombre;

    document.getElementById('btn-agregar-detalle')?.addEventListener('click', () => {
        const cantidadInput = document.getElementById('detalle-cantidad');
        let cantidad = parseInt(cantidadInput.value, 10) || 1;
        cantidad = Math.min(Math.max(cantidad, 1), producto.stock);
        agregarAlCarrito(producto.id, cantidad);
    });

    // Productos relacionados: misma categoría, sin incluir el actual
    const relacionados = obtenerProductos()
        .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
        .slice(0, 4);

    if (relSection) relSection.style.display = relacionados.length ? '' : 'none';
    renderizarProductos('relacionados-container', null, relacionados);
}

// Agregar al carrito y actualizar solo el texto del badge
function agregarAlCarrito(id, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = obtenerProductos().find(p => p.id === id);

    if (producto) {
        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert(`${producto.nombre} agregado al carrito (${cantidad}).`);
    }
}

// Actualizar contador visual del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Evento de carga segura del DOM
document.addEventListener('DOMContentLoaded', () => {
    inicializarBaseDeDatos();

    poblarFiltroCategorias();       // Solo hace algo si existe #filtro-categoria (productos.html)
    actualizarCatalogo();            // Ejecuta en productos.html (respeta filtros activos)
    renderizarProductos('destacados-container', 4); // Ejecuta en index.html
    renderizarDetalleProducto();     // Ejecuta en detalle-producto.html

    actualizarContadorCarrito();

    // Listeners de la barra de filtros (si existen en la página actual)
    document.getElementById('buscador-productos')?.addEventListener('input', actualizarCatalogo);
    document.getElementById('filtro-categoria')?.addEventListener('change', actualizarCatalogo);
    document.getElementById('filtro-orden')?.addEventListener('change', actualizarCatalogo);
    document.getElementById('btn-limpiar-filtros')?.addEventListener('click', limpiarFiltros);
});