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

// Lee el carrito desde localStorage de forma segura
function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    } catch (e) {
        return [];
    }
}

// Guarda el carrito y refresca el contador del navbar
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function calcularTotalCarrito(carrito) {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Suma o resta una unidad a un producto del carrito, respetando el stock actual
function cambiarCantidadCarrito(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    const productoActual = obtenerProductoPorId(id);
    const stockMax = productoActual ? productoActual.stock : item.stock;

    item.cantidad = Math.min(Math.max(item.cantidad + delta, 1), Math.max(stockMax, 1));
    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(i => i.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    guardarCarrito([]);
    renderizarCarrito();
}

// Pinta la lista de productos del carrito y el resumen de compra en carrito.html
function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const resumen = document.getElementById('carrito-resumen');
    if (!contenedor) return; // No estamos en carrito.html

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos desde el catálogo para verlos aquí.</p>
                <a href="productos.html" class="btn-primary">Ir al catálogo</a>
            </div>
        `;
        if (resumen) resumen.innerHTML = '';
        return;
    }

    let html = '';
    carrito.forEach(item => {
        const nombreSeguro = escaparHTML(item.nombre);
        const categoriaSegura = escaparHTML(item.categoria);
        const subtotal = item.precio * item.cantidad;
        const productoActual = obtenerProductoPorId(item.id);
        const stockMax = productoActual ? productoActual.stock : item.stock;

        html += `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${nombreSeguro}" data-nombre="${nombreSeguro}" data-categoria="${categoriaSegura}" onerror="mostrarPlaceholder(this)">
                <div class="carrito-item-info">
                    <h3>${nombreSeguro}</h3>
                    <p class="carrito-item-precio">$${item.precio.toLocaleString('es-CL')} c/u</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button type="button" class="btn-cantidad" onclick="cambiarCantidadCarrito(${item.id}, -1)" aria-label="Restar unidad">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn-cantidad" onclick="cambiarCantidadCarrito(${item.id}, 1)" aria-label="Sumar unidad" ${item.cantidad >= stockMax ? 'disabled' : ''}>+</button>
                </div>
                <p class="carrito-item-subtotal">$${subtotal.toLocaleString('es-CL')}</p>
                <button type="button" class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar producto">✕</button>
            </div>
        `;
    });

    contenedor.innerHTML = html;

    const total = calcularTotalCarrito(carrito);
    if (resumen) {
        resumen.innerHTML = `
            <h2>Resumen del pedido</h2>
            <div class="resumen-linea">
                <span>Subtotal</span>
                <span>$${total.toLocaleString('es-CL')}</span>
            </div>
            <div class="resumen-linea resumen-total">
                <span>Total</span>
                <span>$${total.toLocaleString('es-CL')}</span>
            </div>
            <button type="button" class="btn-primary" id="btn-pagar">Proceder al pago</button>
            <button type="button" class="btn-vaciar" id="btn-vaciar-carrito">Vaciar carrito</button>
        `;

        document.getElementById('btn-pagar')?.addEventListener('click', () => {
            alert('¡Gracias por tu compra! (función de pago próximamente)');
        });
        document.getElementById('btn-vaciar-carrito')?.addEventListener('click', vaciarCarrito);
    }
}

// ===== Panel de Administración de Productos (admin-productos.html) =====

// Guarda la lista completa de productos en localStorage
function guardarProductos(lista) {
    localStorage.setItem('productosDB', JSON.stringify(lista));
}

// Genera el próximo id disponible (máximo id actual + 1)
function generarNuevoId(lista) {
    return lista.length ? Math.max(...lista.map(p => p.id)) + 1 : 1;
}

// Llena el <datalist> de categorías del formulario de admin (sugerencias, no restringe)
function poblarCategoriasDatalist() {
    const datalist = document.getElementById('lista-categorias');
    if (!datalist) return;

    const categorias = [...new Set(obtenerProductos().map(p => p.categoria))].sort();
    datalist.innerHTML = categorias.map(cat => `<option value="${escaparHTML(cat)}">`).join('');
}

function limpiarErroresFormulario() {
    document.querySelectorAll('#form-producto .campo-error').forEach(el => el.textContent = '');
    document.querySelectorAll('#form-producto .is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function mostrarErrorCampo(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    const error = document.getElementById(`error-${idCampo}`);
    if (input) input.classList.add('is-invalid');
    if (error) error.textContent = mensaje;
}

// Valida los campos del formulario de producto; retorna el objeto de datos
// listo para guardar, o null si hay errores (y muestra los mensajes en pantalla)
function validarFormularioProducto(idEditando) {
    limpiarErroresFormulario();

    const nombre = document.getElementById('input-nombre').value.trim();
    const codigo = document.getElementById('input-codigo').value.trim();
    const categoria = document.getElementById('input-categoria').value.trim();
    const precio = parseFloat(document.getElementById('input-precio').value);
    const stock = parseInt(document.getElementById('input-stock').value, 10);
    const imagen = document.getElementById('input-imagen').value.trim();
    const descripcion = document.getElementById('input-descripcion').value.trim();

    let valido = true;
    const lista = obtenerProductos();

    if (nombre.length < 3) {
        mostrarErrorCampo('input-nombre', 'El nombre debe tener al menos 3 caracteres.');
        valido = false;
    }

    if (codigo.length < 3) {
        mostrarErrorCampo('input-codigo', 'El código debe tener al menos 3 caracteres.');
        valido = false;
    } else {
        const codigoDuplicado = lista.some(p =>
            p.codigo.toLowerCase() === codigo.toLowerCase() && p.id !== idEditando
        );
        if (codigoDuplicado) {
            mostrarErrorCampo('input-codigo', 'Ya existe un producto con este código.');
            valido = false;
        }
    }

    if (!categoria) {
        mostrarErrorCampo('input-categoria', 'Escribe o selecciona una categoría.');
        valido = false;
    }

    if (isNaN(precio) || precio <= 0) {
        mostrarErrorCampo('input-precio', 'El precio debe ser un número mayor a 0.');
        valido = false;
    }

    if (isNaN(stock) || stock < 0) {
        mostrarErrorCampo('input-stock', 'El stock debe ser 0 o un número positivo.');
        valido = false;
    }

    if (!valido) return null;

    return {
        nombre,
        codigo,
        categoria,
        precio,
        stock,
        imagen: imagen || '',
        descripcion: descripcion || 'Sin descripción disponible por el momento.'
    };
}

// Abre el modal de producto. Sin id = modo "crear"; con id = modo "editar"
function abrirFormularioProducto(id = null) {
    const form = document.getElementById('form-producto');
    if (!form) return;

    limpiarErroresFormulario();
    form.reset();
    document.getElementById('input-id-editando').value = '';

    const modalTitulo = document.getElementById('modal-producto-titulo');

    if (id !== null) {
        const producto = obtenerProductoPorId(id);
        if (!producto) return;

        if (modalTitulo) modalTitulo.textContent = 'Editar Producto';
        document.getElementById('input-id-editando').value = producto.id;
        document.getElementById('input-nombre').value = producto.nombre;
        document.getElementById('input-codigo').value = producto.codigo;
        document.getElementById('input-categoria').value = producto.categoria;
        document.getElementById('input-precio').value = producto.precio;
        document.getElementById('input-stock').value = producto.stock;
        document.getElementById('input-imagen').value = producto.imagen;
        document.getElementById('input-descripcion').value = producto.descripcion || '';
    } else if (modalTitulo) {
        modalTitulo.textContent = 'Agregar Producto';
    }

    const modalEl = document.getElementById('modal-producto');
    if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}

// Procesa el submit del formulario: crea o actualiza según input-id-editando
function manejarSubmitFormularioProducto(event) {
    event.preventDefault();

    const idEditandoRaw = document.getElementById('input-id-editando').value;
    const idEditando = idEditandoRaw ? Number(idEditandoRaw) : null;

    const datos = validarFormularioProducto(idEditando);
    if (!datos) return;

    const lista = obtenerProductos();

    if (idEditando !== null) {
        const index = lista.findIndex(p => p.id === idEditando);
        if (index !== -1) lista[index] = { ...lista[index], ...datos };
    } else {
        lista.push({ id: generarNuevoId(lista), ...datos });
    }

    guardarProductos(lista);
    renderizarTablaAdmin();
    poblarCategoriasDatalist();

    const modalEl = document.getElementById('modal-producto');
    if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    }
}

// Elimina un producto tras confirmar
function eliminarProducto(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;

    const lista = obtenerProductos().filter(p => p.id !== id);
    guardarProductos(lista);
    renderizarTablaAdmin();
    poblarCategoriasDatalist();
}

// Reemplaza el catálogo actual por los 12 productos originales de fábrica
function restablecerCatalogo() {
    if (!confirm('Esto reemplazará todos los productos actuales por el catálogo original. ¿Continuar?')) return;

    guardarProductos(JSON.parse(JSON.stringify(productosIniciales)));
    renderizarTablaAdmin();
    poblarCategoriasDatalist();
}

// Pinta la tabla de administración con todos los productos guardados
function renderizarTablaAdmin() {
    const tbody = document.getElementById('admin-tabla-productos');
    if (!tbody) return; // No estamos en admin-productos.html

    const lista = obtenerProductos();

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="sin-resultados">No hay productos cargados.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(prod => {
        const nombreSeguro = escaparHTML(prod.nombre);
        const categoriaSegura = escaparHTML(prod.categoria);
        const codigoSeguro = escaparHTML(prod.codigo);

        return `
            <tr>
                <td><img class="admin-thumb" src="${prod.imagen}" alt="${nombreSeguro}" data-nombre="${nombreSeguro}" data-categoria="${categoriaSegura}" onerror="mostrarPlaceholder(this)"></td>
                <td>${codigoSeguro}</td>
                <td>${nombreSeguro}</td>
                <td>${categoriaSegura}</td>
                <td>$${prod.precio.toLocaleString('es-CL')}</td>
                <td class="${prod.stock <= 0 ? 'admin-stock-bajo' : ''}">${prod.stock}</td>
                <td class="admin-acciones">
                    <button type="button" class="btn-admin-editar" onclick="abrirFormularioProducto(${prod.id})">Editar</button>
                    <button type="button" class="btn-admin-eliminar" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== Autenticación (login.html / registro.html) =====
// Nota: esto corre 100% en el navegador (sin backend), así que el "hash" de
// abajo es solo una ofuscación simple para no guardar contraseñas en texto
// plano en localStorage. No reemplaza un hash criptográfico real (bcrypt,
// argon2, etc.) que se usaría en un servidor de verdad.
function hashSimple(texto) {
    let hash = 0;
    const str = String(texto);
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0; // hash de 32 bits
    }
    return (hash >>> 0).toString(16) + '_' + str.length;
}

// Crea el usuario administrador de prueba la primera vez que se carga el sitio
// (admin@prosetup.cl / admin123)
function inicializarUsuarios() {
    if (!localStorage.getItem('usuariosDB')) {
        const admin = {
            nombre: 'Administrador',
            email: 'admin@prosetup.cl',
            passwordHash: hashSimple('admin123'),
            rol: 'admin'
        };
        localStorage.setItem('usuariosDB', JSON.stringify([admin]));
    }
}

function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem('usuariosDB')) || [];
    } catch (e) {
        return [];
    }
}

function guardarUsuarios(lista) {
    localStorage.setItem('usuariosDB', JSON.stringify(lista));
}

// La sesión vive en sessionStorage: se cierra sola al cerrar la pestaña/navegador
function obtenerUsuarioActual() {
    try {
        return JSON.parse(sessionStorage.getItem('usuarioActual'));
    } catch (e) {
        return null;
    }
}

function guardarSesion(usuario) {
    const { passwordHash, ...usuarioSeguro } = usuario; // nunca guardamos el hash en la sesión
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioSeguro));
}

function cerrarSesion() {
    sessionStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
}

// Muestra "Hola, {nombre}" + Cerrar sesión (y Admin si corresponde) en el navbar,
// u oculta esos elementos y muestra Iniciar Sesión/Registro si no hay sesión
function actualizarNavbarUsuario() {
    const usuario = obtenerUsuarioActual();
    const linkLogin = document.getElementById('link-login');
    const linkRegistro = document.getElementById('link-registro');
    const usuarioInfo = document.getElementById('usuario-info');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const linkAdmin = document.getElementById('link-admin');

    if (usuario) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkRegistro) linkRegistro.style.display = 'none';
        if (usuarioInfo) usuarioInfo.style.display = 'flex';
        if (usuarioNombre) usuarioNombre.textContent = usuario.nombre;
        if (linkAdmin) linkAdmin.style.display = usuario.rol === 'admin' ? 'inline' : 'none';
    } else {
        if (linkLogin) linkLogin.style.display = '';
        if (linkRegistro) linkRegistro.style.display = '';
        if (usuarioInfo) usuarioInfo.style.display = 'none';
    }
}

// Bloquea el acceso a admin-productos.html si no hay sesión de administrador
function protegerPaginaAdmin() {
    const tabla = document.getElementById('admin-tabla-productos');
    if (!tabla) return; // No estamos en admin-productos.html

    const usuario = obtenerUsuarioActual();
    if (!usuario || usuario.rol !== 'admin') {
        alert('Debes iniciar sesión como administrador para acceder a esta página.');
        window.location.href = 'login.html';
    }
}

function limpiarErroresFormularioAuth(formId) {
    document.querySelectorAll(`#${formId} .campo-error`).forEach(el => el.textContent = '');
    document.querySelectorAll(`#${formId} .is-invalid`).forEach(el => el.classList.remove('is-invalid'));
}

function mostrarErrorCampoAuth(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    const error = document.getElementById(`error-${idCampo}`);
    if (input) input.classList.add('is-invalid');
    if (error) error.textContent = mensaje;
}

// Valida y procesa el formulario de registro.html
function manejarSubmitRegistro(event) {
    event.preventDefault();
    limpiarErroresFormularioAuth('form-registro');

    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirmar = document.getElementById('reg-confirmar').value;

    let valido = true;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre.length < 3) {
        mostrarErrorCampoAuth('reg-nombre', 'Ingresa tu nombre completo.');
        valido = false;
    }

    if (!regexEmail.test(email)) {
        mostrarErrorCampoAuth('reg-email', 'Ingresa un correo válido.');
        valido = false;
    } else if (obtenerUsuarios().some(u => u.email === email)) {
        mostrarErrorCampoAuth('reg-email', 'Ya existe una cuenta con este correo.');
        valido = false;
    }

    if (password.length < 6) {
        mostrarErrorCampoAuth('reg-password', 'La contraseña debe tener al menos 6 caracteres.');
        valido = false;
    }

    if (confirmar !== password) {
        mostrarErrorCampoAuth('reg-confirmar', 'Las contraseñas no coinciden.');
        valido = false;
    }

    if (!valido) return;

    const nuevoUsuario = { nombre, email, passwordHash: hashSimple(password), rol: 'cliente' };
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    guardarSesion(nuevoUsuario);
    window.location.href = 'index.html';
}

// Valida y procesa el formulario de login.html
function manejarSubmitLogin(event) {
    event.preventDefault();
    limpiarErroresFormularioAuth('form-login');

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    let valido = true;
    if (!email) {
        mostrarErrorCampoAuth('login-email', 'Ingresa tu correo.');
        valido = false;
    }
    if (!password) {
        mostrarErrorCampoAuth('login-password', 'Ingresa tu contraseña.');
        valido = false;
    }
    if (!valido) return;

    const usuario = obtenerUsuarios().find(u => u.email === email);
    if (!usuario) {
        mostrarErrorCampoAuth('login-email', 'No existe una cuenta con este correo.');
        return;
    }

    if (hashSimple(password) !== usuario.passwordHash) {
        mostrarErrorCampoAuth('login-password', 'Contraseña incorrecta.');
        return;
    }

    guardarSesion(usuario);
    window.location.href = usuario.rol === 'admin' ? 'admin-productos.html' : 'index.html';
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
    inicializarUsuarios();

    poblarFiltroCategorias();       // Solo hace algo si existe #filtro-categoria (productos.html)
    actualizarCatalogo();            // Ejecuta en productos.html (respeta filtros activos)
    renderizarProductos('destacados-container', 4); // Ejecuta en index.html
    renderizarDetalleProducto();     // Ejecuta en detalle-producto.html
    renderizarCarrito();             // Ejecuta en carrito.html
    renderizarTablaAdmin();          // Ejecuta en admin-productos.html
    poblarCategoriasDatalist();      // Sugerencias de categoría en el form de admin

    actualizarContadorCarrito();
    actualizarNavbarUsuario();       // Muestra "Hola, {nombre}" si hay sesión activa
    protegerPaginaAdmin();           // Solo deja pasar a admin-productos.html si el rol es admin

    // Listeners de la barra de filtros (si existen en la página actual)
    document.getElementById('buscador-productos')?.addEventListener('input', actualizarCatalogo);
    document.getElementById('filtro-categoria')?.addEventListener('change', actualizarCatalogo);
    document.getElementById('filtro-orden')?.addEventListener('change', actualizarCatalogo);
    document.getElementById('btn-limpiar-filtros')?.addEventListener('click', limpiarFiltros);

    // Listeners del panel de administración (si existen en la página actual)
    document.getElementById('form-producto')?.addEventListener('submit', manejarSubmitFormularioProducto);
    document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => abrirFormularioProducto());
    document.getElementById('btn-restablecer-catalogo')?.addEventListener('click', restablecerCatalogo);
    document.getElementById('modal-producto')?.addEventListener('hidden.bs.modal', limpiarErroresFormulario);

    // Listeners de autenticación (si existen en la página actual)
    document.getElementById('form-login')?.addEventListener('submit', manejarSubmitLogin);
    document.getElementById('form-registro')?.addEventListener('submit', manejarSubmitRegistro);
    document.getElementById('link-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
    });
});