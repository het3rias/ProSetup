/* ============================================
   ProSetup - Panel de Administración
   ============================================
   Maneja: protección de rutas por rol, el menú lateral,
   y el mantenedor (listar/crear/editar/eliminar/ver) de
   Productos y Usuarios.

   Roles:
   - Administrador: acceso total.
   - Vendedor: solo puede VER el listado y detalle de productos.
     No ve el menú de Usuarios ni los botones de crear/editar/eliminar.
   - Cliente: no puede entrar a ninguna página admin-*.html.
   ============================================ */

// Revisa que haya sesión activa y que el rol esté en la lista permitida.
// Si no cumple, redirige y corta la ejecución del resto del script.
function protegerPaginaAdmin(rolesPermitidos) {
    const usuario = obtenerUsuarioActual();
    if (!usuario) {
        alert("Debes iniciar sesión para entrar al panel de administración.");
        window.location.href = "login.html";
        return null;
    }
    if (!rolesPermitidos.includes(usuario.tipoUsuario)) {
        alert("Tu rol (" + usuario.tipoUsuario + ") no tiene permiso para ver esta página.");
        window.location.href = "admin-home.html";
        return null;
    }
    return usuario;
}

// Pinta el nombre, el rol y marca el link activo en el menú lateral.
// Además esconde del sidebar y de la página todo lo que sea exclusivo
// de Administrador cuando el usuario conectado es Vendedor.
function pintarSidebarAdmin(usuario, paginaActual) {
    const nombreEl = document.getElementById("admin-nombre-usuario");
    if (nombreEl) nombreEl.textContent = usuario.nombre;

    const rolEl = document.getElementById("admin-rol-badge");
    if (rolEl) rolEl.textContent = usuario.tipoUsuario;

    document.querySelectorAll(".admin-sidebar nav a[data-pagina]").forEach(a => {
        a.classList.toggle("activo", a.dataset.pagina === paginaActual);
    });

    if (usuario.tipoUsuario !== "Administrador") {
        document.getElementById("admin-nav-usuarios")?.classList.add("d-none");
        document.querySelectorAll(".solo-admin").forEach(el => el.classList.add("d-none"));
    }

    document.getElementById("link-logout-admin")?.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
    });
}

/* ================= Mantenedor de Productos ================= */

function llenarSelectCategorias(idSelect, categoriaSeleccionada) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione categoría --</option>' +
        CATEGORIAS_PRODUCTO.map(c => `<option value="${c}" ${c === categoriaSeleccionada ? "selected" : ""}>${c}</option>`).join("");
}

function renderizarTablaAdminProductos(soloLectura) {
    const tbody = document.getElementById("tabla-productos");
    if (!tbody) return;

    const productos = obtenerProductos();
    let html = "";

    productos.forEach(prod => {
        html += `
            <tr>
                <td><img src="${prod.imagen}" width="50" height="50" style="object-fit:cover" onerror="this.src='img/placeholder.png'"></td>
                <td>${prod.codigo}</td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria}</td>
                <td>$${Number(prod.precio).toLocaleString("es-CL")}</td>
                <td>${prod.stock} ${tieneStockCritico(prod) ? '<span class="badge bg-warning text-dark">bajo</span>' : ""}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="mostrarProductoModal(${prod.id})">Ver</button>
                    <button type="button" class="btn btn-sm btn-outline-primary solo-admin ${soloLectura ? "d-none" : ""}" onclick="cargarProductoEnFormulario(${prod.id})">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger solo-admin ${soloLectura ? "d-none" : ""}" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html || `<tr><td colspan="7">No hay productos registrados.</td></tr>`;
}

// Muestra el modal "Mostrar Producto" de solo lectura
function mostrarProductoModal(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    document.getElementById("modal-producto-contenido").innerHTML = `
        <img src="${producto.imagen}" class="img-fluid rounded mb-3" style="max-height:180px" onerror="this.src='img/placeholder.png'">
        <dl class="row mb-0">
            <dt class="col-sm-4">Código</dt><dd class="col-sm-8">${producto.codigo}</dd>
            <dt class="col-sm-4">Nombre</dt><dd class="col-sm-8">${producto.nombre}</dd>
            <dt class="col-sm-4">Categoría</dt><dd class="col-sm-8">${producto.categoria}</dd>
            <dt class="col-sm-4">Precio</dt><dd class="col-sm-8">$${Number(producto.precio).toLocaleString("es-CL")}</dd>
            <dt class="col-sm-4">Stock</dt><dd class="col-sm-8">${producto.stock}</dd>
            <dt class="col-sm-4">Stock crítico</dt><dd class="col-sm-8">${producto.stockCritico ?? "No definido"}</dd>
            <dt class="col-sm-4">Descripción</dt><dd class="col-sm-8">${producto.descripcion || "Sin descripción."}</dd>
        </dl>
    `;
    new bootstrap.Modal(document.getElementById("modal-producto")).show();
}

function cargarProductoEnFormulario(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    document.getElementById("admin-id").value = producto.id;
    document.getElementById("admin-codigo").value = producto.codigo;
    document.getElementById("admin-nombre").value = producto.nombre;
    document.getElementById("admin-descripcion").value = producto.descripcion || "";
    document.getElementById("admin-precio").value = producto.precio;
    document.getElementById("admin-stock").value = producto.stock;
    document.getElementById("admin-stock-critico").value = producto.stockCritico ?? "";
    llenarSelectCategorias("admin-categoria", producto.categoria);
    document.getElementById("admin-imagen").value = producto.imagen;

    document.getElementById("titulo-formulario").textContent = "Editar Producto";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormularioAdminProducto() {
    document.getElementById("form-admin-producto").reset();
    document.getElementById("admin-id").value = "";
    llenarSelectCategorias("admin-categoria", "");
    document.getElementById("titulo-formulario").textContent = "Nuevo Producto";
    ["codigo", "nombre", "precio", "stock", "stock-critico", "categoria"].forEach(c => mostrarError(c, ""));
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const productos = obtenerProductos().filter(p => p.id !== id);
    guardarProductos(productos);
    renderizarTablaAdminProductos(false);
}

function validarProducto(datos) {
    let esValido = true;

    if (datos.codigo.length < 3) {
        mostrarError("codigo", "El código es obligatorio (mínimo 3 caracteres).");
        esValido = false;
    }
    if (datos.nombre.length === 0 || datos.nombre.length > 100) {
        mostrarError("nombre", "El nombre es obligatorio (máximo 100 caracteres).");
        esValido = false;
    }
    if (datos.descripcion.length > 500) {
        mostrarError("descripcion", "Máximo 500 caracteres.");
        esValido = false;
    }
    if (datos.precio === "" || isNaN(datos.precio) || Number(datos.precio) < 0) {
        mostrarError("precio", "El precio es obligatorio y no puede ser negativo.");
        esValido = false;
    }
    if (datos.stock === "" || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
        mostrarError("stock", "El stock es obligatorio, entero y no puede ser negativo.");
        esValido = false;
    }
    if (datos.stockCritico !== "" && (!Number.isInteger(Number(datos.stockCritico)) || Number(datos.stockCritico) < 0)) {
        mostrarError("stock-critico", "Debe ser un número entero mayor o igual a 0.");
        esValido = false;
    }
    if (datos.categoria === "") {
        mostrarError("categoria", "Selecciona una categoría.");
        esValido = false;
    }

    return esValido;
}

// Validación en vivo del formulario de producto (sin enviar el formulario)
function validarProductoEnVivo() {
    const datos = {
        codigo: document.getElementById("admin-codigo").value.trim(),
        nombre: document.getElementById("admin-nombre").value.trim(),
        descripcion: document.getElementById("admin-descripcion").value.trim(),
        precio: document.getElementById("admin-precio").value,
        stock: document.getElementById("admin-stock").value,
        stockCritico: document.getElementById("admin-stock-critico").value,
        categoria: document.getElementById("admin-categoria").value
    };
    validarProducto(datos);
}

function manejarGuardarProducto(event) {
    event.preventDefault();
    ["codigo", "nombre", "descripcion", "precio", "stock", "stock-critico", "categoria"].forEach(c => mostrarError(c, ""));

    const idEditando = document.getElementById("admin-id").value;
    const datos = {
        codigo: document.getElementById("admin-codigo").value.trim(),
        nombre: document.getElementById("admin-nombre").value.trim(),
        descripcion: document.getElementById("admin-descripcion").value.trim(),
        precio: document.getElementById("admin-precio").value,
        stock: document.getElementById("admin-stock").value,
        stockCritico: document.getElementById("admin-stock-critico").value,
        categoria: document.getElementById("admin-categoria").value,
        imagen: document.getElementById("admin-imagen").value.trim() || "img/placeholder.png"
    };

    if (!validarProducto(datos)) return;

    const productos = obtenerProductos();

    if (idEditando) {
        const producto = productos.find(p => p.id === Number(idEditando));
        Object.assign(producto, {
            codigo: datos.codigo, nombre: datos.nombre, descripcion: datos.descripcion,
            precio: Number(datos.precio), stock: Number(datos.stock),
            stockCritico: datos.stockCritico === "" ? null : Number(datos.stockCritico),
            categoria: datos.categoria, imagen: datos.imagen
        });
    } else {
        const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({
            id: nuevoId, codigo: datos.codigo, nombre: datos.nombre, descripcion: datos.descripcion,
            precio: Number(datos.precio), stock: Number(datos.stock),
            stockCritico: datos.stockCritico === "" ? null : Number(datos.stockCritico),
            categoria: datos.categoria, imagen: datos.imagen
        });
    }

    guardarProductos(productos);
    renderizarTablaAdminProductos(false);
    limpiarFormularioAdminProducto();
}

/* ================= Mantenedor de Usuarios ================= */

function renderizarTablaAdminUsuarios() {
    const tbody = document.getElementById("tabla-usuarios");
    if (!tbody) return;

    const usuarios = obtenerUsuarios();
    let html = "";

    usuarios.forEach(u => {
        html += `
            <tr>
                <td>${u.run}</td>
                <td>${u.nombre} ${u.apellidos}</td>
                <td>${u.email}</td>
                <td><span class="badge bg-secondary">${u.tipoUsuario}</span></td>
                <td>${u.region ? u.region + " / " + u.comuna : "-"}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="mostrarUsuarioModal('${u.email}')">Ver</button>
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="cargarUsuarioEnFormulario('${u.email}')">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${u.email}')">Eliminar</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html || `<tr><td colspan="6">No hay usuarios registrados.</td></tr>`;
}

function mostrarUsuarioModal(email) {
    const usuario = obtenerUsuarios().find(u => u.email === email);
    if (!usuario) return;

    document.getElementById("modal-usuario-contenido").innerHTML = `
        <dl class="row mb-0">
            <dt class="col-sm-4">RUN</dt><dd class="col-sm-8">${usuario.run}</dd>
            <dt class="col-sm-4">Nombre</dt><dd class="col-sm-8">${usuario.nombre} ${usuario.apellidos}</dd>
            <dt class="col-sm-4">Correo</dt><dd class="col-sm-8">${usuario.email}</dd>
            <dt class="col-sm-4">Teléfono</dt><dd class="col-sm-8">${usuario.telefono || "No registrado"}</dd>
            <dt class="col-sm-4">Fecha nacimiento</dt><dd class="col-sm-8">${usuario.fechaNacimiento || "No registrada"}</dd>
            <dt class="col-sm-4">Tipo de usuario</dt><dd class="col-sm-8">${usuario.tipoUsuario}</dd>
            <dt class="col-sm-4">Región / Comuna</dt><dd class="col-sm-8">${usuario.region || "-"} / ${usuario.comuna || "-"}</dd>
            <dt class="col-sm-4">Dirección</dt><dd class="col-sm-8">${usuario.direccion}</dd>
        </dl>
    `;
    new bootstrap.Modal(document.getElementById("modal-usuario")).show();
}

function cargarUsuarioEnFormulario(email) {
    const usuario = obtenerUsuarios().find(u => u.email === email);
    if (!usuario) return;

    document.getElementById("admin-u-email-original").value = usuario.email;
    document.getElementById("admin-u-run").value = usuario.run;
    document.getElementById("admin-u-nombre").value = usuario.nombre;
    document.getElementById("admin-u-apellidos").value = usuario.apellidos;
    document.getElementById("admin-u-email").value = usuario.email;
    document.getElementById("admin-u-password").value = "";
    document.getElementById("admin-u-confirmar").value = "";
    document.getElementById("admin-u-telefono").value = usuario.telefono || "";
    document.getElementById("admin-u-fecha-nacimiento").value = usuario.fechaNacimiento || "";
    document.getElementById("admin-u-tipo").value = usuario.tipoUsuario;
    document.getElementById("admin-u-region").value = usuario.region || "";
    cargarComunasPorRegion("admin-u-region", "admin-u-comuna");
    document.getElementById("admin-u-comuna").value = usuario.comuna || "";
    document.getElementById("admin-u-direccion").value = usuario.direccion;

    document.getElementById("titulo-formulario-usuario").textContent = "Editar Usuario";
    document.getElementById("aviso-password-opcional").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormularioAdminUsuario() {
    document.getElementById("form-admin-usuario").reset();
    document.getElementById("admin-u-email-original").value = "";
    document.getElementById("admin-u-comuna").innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    document.getElementById("titulo-formulario-usuario").textContent = "Nuevo Usuario";
    document.getElementById("aviso-password-opcional").classList.add("d-none");
    ["run", "nombre", "apellidos", "email", "password", "confirmar", "direccion", "region", "comuna"]
        .forEach(c => mostrarError("u-" + c, ""));
}

function eliminarUsuario(email) {
    if (!confirm("¿Eliminar este usuario?")) return;
    const usuarios = obtenerUsuarios().filter(u => u.email !== email);
    guardarUsuarios(usuarios);
    renderizarTablaAdminUsuarios();
}

// Validación en vivo del formulario de usuario del admin (sin enviar el formulario)
function validarUsuarioAdminEnVivo() {
    const emailOriginal = document.getElementById("admin-u-email-original").value || null;
    const datos = leerDatosFormularioUsuario("admin-u-");
    validarDatosUsuario(datos, "u-", { esEdicion: Boolean(emailOriginal), emailOriginal });
}

function manejarGuardarUsuario(event) {
    event.preventDefault();
    const campos = ["run", "nombre", "apellidos", "email", "password", "confirmar", "direccion", "region", "comuna"];
    campos.forEach(c => mostrarError("u-" + c, ""));

    const emailOriginal = document.getElementById("admin-u-email-original").value || null;
    const esEdicion = Boolean(emailOriginal);

    const datos = leerDatosFormularioUsuario("admin-u-");
    const tipoUsuario = document.getElementById("admin-u-tipo").value;

    if (!validarDatosUsuario(datos, "u-", { esEdicion, emailOriginal })) return;

    const usuarios = obtenerUsuarios();

    if (esEdicion) {
        const usuario = usuarios.find(u => u.email === emailOriginal);
        Object.assign(usuario, {
            run: datos.run, nombre: datos.nombre, apellidos: datos.apellidos, email: datos.email,
            telefono: datos.telefono, fechaNacimiento: datos.fechaNacimiento, tipoUsuario,
            region: datos.region, comuna: datos.comuna, direccion: datos.direccion
        });
        if (datos.password !== "") usuario.password = datos.password;
        actualizarSesionSiCorresponde(usuario);
    } else {
        usuarios.push({
            run: datos.run, nombre: datos.nombre, apellidos: datos.apellidos, email: datos.email,
            password: datos.password, telefono: datos.telefono, fechaNacimiento: datos.fechaNacimiento,
            tipoUsuario, region: datos.region, comuna: datos.comuna, direccion: datos.direccion
        });
    }

    guardarUsuarios(usuarios);
    renderizarTablaAdminUsuarios();
    limpiarFormularioAdminUsuario();
}

/* ================= Inicialización según la página ================= */

document.addEventListener("DOMContentLoaded", () => {
    // admin-productos.html
    if (document.getElementById("tabla-productos")) {
        const usuario = protegerPaginaAdmin(["Administrador", "Vendedor"]);
        if (!usuario) return;
        pintarSidebarAdmin(usuario, "productos");

        const esVendedor = usuario.tipoUsuario === "Vendedor";
        llenarSelectCategorias("admin-categoria", "");
        renderizarTablaAdminProductos(esVendedor);

        document.getElementById("form-admin-producto")?.addEventListener("submit", manejarGuardarProducto);
        document.getElementById("btn-cancelar-edicion")?.addEventListener("click", limpiarFormularioAdminProducto);

        if (!esVendedor) {
            ["codigo", "nombre", "descripcion", "precio", "stock", "stock-critico", "categoria"].forEach(campo => {
                document.getElementById("admin-" + campo)?.addEventListener("blur", validarProductoEnVivo);
            });
        }
    }

    // admin-usuarios.html (solo Administrador)
    if (document.getElementById("tabla-usuarios")) {
        const usuario = protegerPaginaAdmin(["Administrador"]);
        if (!usuario) return;
        pintarSidebarAdmin(usuario, "usuarios");

        inicializarSelectRegionComuna("admin-u-region", "admin-u-comuna");
        renderizarTablaAdminUsuarios();

        document.getElementById("form-admin-usuario")?.addEventListener("submit", manejarGuardarUsuario);
        document.getElementById("btn-cancelar-edicion-usuario")?.addEventListener("click", limpiarFormularioAdminUsuario);

        ["run", "nombre", "apellidos", "email", "password", "confirmar", "direccion", "region", "comuna"].forEach(campo => {
            document.getElementById("admin-u-" + campo)?.addEventListener("blur", validarUsuarioAdminEnVivo);
        });
        document.getElementById("admin-u-password")?.addEventListener("input", validarUsuarioAdminEnVivo);
        document.getElementById("admin-u-confirmar")?.addEventListener("input", validarUsuarioAdminEnVivo);
    }

    // admin-home.html
    if (document.getElementById("admin-home-saludo")) {
        const usuario = protegerPaginaAdmin(["Administrador", "Vendedor"]);
        if (!usuario) return;
        pintarSidebarAdmin(usuario, "home");
        document.getElementById("admin-home-saludo").textContent = "¡Hola, " + usuario.nombre + "!";

        const productos = obtenerProductos();
        document.getElementById("stat-total-productos").textContent = productos.length;
        document.getElementById("stat-stock-critico").textContent = productos.filter(tieneStockCritico).length;
        document.getElementById("stat-total-usuarios").textContent = obtenerUsuarios().length;
    }
});
