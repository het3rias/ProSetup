

function protegerPaginaAdmin() {
    const usuario = obtenerUsuarioActual();
    if (!usuario || !usuario.esAdmin) {
        alert("Debes iniciar sesión como administrador para entrar aquí.");
        window.location.href = "login.html";
    }
}

// Pinta la tabla de productos en admin-productos.html
function renderizarTablaAdmin() {
    const tbody = document.getElementById("tabla-productos");
    if (!tbody) return;

    const productos = obtenerProductos();
    let html = "";

    productos.forEach(prod => {
        html += `
            <tr>
                <td><img src="${prod.imagen}" width="50" height="50" style="object-fit:cover" onerror="this.src='img/placeholder.png'"></td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria}</td>
                <td>$${prod.precio.toLocaleString("es-CL")}</td>
                <td>${prod.stock}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="cargarProductoEnFormulario(${prod.id})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Copia los datos de un producto existente al formulario, para editarlo
function cargarProductoEnFormulario(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    document.getElementById("admin-id").value = producto.id;
    document.getElementById("admin-nombre").value = producto.nombre;
    document.getElementById("admin-categoria").value = producto.categoria;
    document.getElementById("admin-precio").value = producto.precio;
    document.getElementById("admin-stock").value = producto.stock;
    document.getElementById("admin-imagen").value = producto.imagen;

    document.getElementById("titulo-formulario").textContent = "Editar Producto";
}

function limpiarFormularioAdmin() {
    document.getElementById("form-admin-producto").reset();
    document.getElementById("admin-id").value = "";
    document.getElementById("titulo-formulario").textContent = "Agregar Producto";
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const productos = obtenerProductos().filter(p => p.id !== id);
    guardarProductos(productos);
    renderizarTablaAdmin();
}

// Guarda el producto nuevo o edita uno existente, según si admin-id trae un valor
function manejarGuardarProducto(event) {
    event.preventDefault();

    const idEditando = document.getElementById("admin-id").value;
    const nombre = document.getElementById("admin-nombre").value.trim();
    const categoria = document.getElementById("admin-categoria").value.trim();
    const precio = Number(document.getElementById("admin-precio").value);
    const stock = Number(document.getElementById("admin-stock").value);
    const imagen = document.getElementById("admin-imagen").value.trim() || "img/placeholder.png";

    if (nombre.length < 3 || categoria === "" || precio <= 0 || stock < 0) {
        alert("Revisa los datos: nombre, categoría, precio y stock son obligatorios.");
        return;
    }

    const productos = obtenerProductos();

    if (idEditando) {
        // Editar: buscamos el producto por id y le cambiamos los datos
        const producto = productos.find(p => p.id === Number(idEditando));
        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.precio = precio;
        producto.stock = stock;
        producto.imagen = imagen;
    } else {
        // Crear: el nuevo id es el mayor id existente + 1
        const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({ id: nuevoId, nombre, categoria, precio, stock, imagen });
    }

    guardarProductos(productos);
    renderizarTablaAdmin();
    limpiarFormularioAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("tabla-productos")) return; // no estamos en admin-productos.html

    protegerPaginaAdmin();
    renderizarTablaAdmin();

    document.getElementById("form-admin-producto")?.addEventListener("submit", manejarGuardarProducto);
    document.getElementById("btn-cancelar-edicion")?.addEventListener("click", limpiarFormularioAdmin);
});
