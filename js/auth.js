/* ============================================
   ProSetup - Registro, Login y sesión
   ============================================
   Guardamos los usuarios en localStorage (clave "usuariosDB")
   y la sesión activa en sessionStorage (clave "usuarioActual").

   sessionStorage se borra solo al cerrar el navegador;
   localStorage se queda guardado siempre hasta que lo borres.

   IMPORTANTE (para aprender): aquí guardamos la contraseña tal cual
   la escribe el usuario. En un proyecto real NUNCA se hace esto:
   la contraseña se envía a un servidor y se guarda "hasheada"
   (cifrada en un solo sentido). Como este proyecto no tiene servidor,
   lo dejamos simple a propósito para que el código sea fácil de leer.
   ============================================ */

// Solo se aceptan estos 3 dominios de correo (lo pide el enunciado).
// Explicación del regex:
//   ^[^\s@]+        -> uno o más caracteres antes del @ (sin espacios ni otro @)
//   @                -> el símbolo arroba, tal cual
//   (duoc\.cl|profesor\.duoc\.cl|gmail\.com) -> el dominio debe ser EXACTAMENTE
//                       uno de estos tres (el \. es un punto literal)
//   $                -> nada más después del dominio
//   la "i" al final  -> no importa si son mayúsculas o minúsculas
const REGEX_CORREO_PERMITIDO = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

// Crea una cuenta de administrador de prueba la primera vez que se abre el sitio
function inicializarUsuarios() {
    if (!localStorage.getItem("usuariosDB")) {
        const admin = { nombre: "Administrador", email: "admin@duoc.cl", password: "admin123", esAdmin: true };
        localStorage.setItem("usuariosDB", JSON.stringify([admin]));
    }
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosDB")) || [];
}

function guardarUsuarios(lista) {
    localStorage.setItem("usuariosDB", JSON.stringify(lista));
}

function obtenerUsuarioActual() {
    return JSON.parse(sessionStorage.getItem("usuarioActual"));
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
}

// Muestra un mensaje de error debajo de un campo del formulario
function mostrarError(idCampo, mensaje) {
    document.getElementById("error-" + idCampo).textContent = mensaje;
}

function limpiarErrores(idsCampos) {
    idsCampos.forEach(id => mostrarError(id, ""));
}

/* ---------------- Registro ---------------- */

function manejarRegistro(event) {
    event.preventDefault();
    limpiarErrores(["nombre", "email", "password", "confirmar"]);

    const nombre = document.getElementById("reg-nombre").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    const confirmar = document.getElementById("reg-confirmar").value;

    let esValido = true;

    if (nombre.length < 3) {
        mostrarError("nombre", "Ingresa tu nombre completo.");
        esValido = false;
    }

    if (!REGEX_CORREO_PERMITIDO.test(email)) {
        mostrarError("email", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        esValido = false;
    } else if (obtenerUsuarios().some(u => u.email === email)) {
        mostrarError("email", "Ya existe una cuenta con este correo.");
        esValido = false;
    }

    if (password.length < 6) {
        mostrarError("password", "La contraseña debe tener al menos 6 caracteres.");
        esValido = false;
    }

    if (confirmar !== password) {
        mostrarError("confirmar", "Las contraseñas no coinciden.");
        esValido = false;
    }

    if (!esValido) return;

    const nuevoUsuario = { nombre, email, password, esAdmin: false };
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    sessionStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
    window.location.href = "index.html";
}

/* ---------------- Login ---------------- */

function manejarLogin(event) {
    event.preventDefault();
    limpiarErrores(["email", "password"]);

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (!REGEX_CORREO_PERMITIDO.test(email)) {
        mostrarError("email", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return;
    }

    const usuario = obtenerUsuarios().find(u => u.email === email);

    if (!usuario || usuario.password !== password) {
        mostrarError("password", "Correo o contraseña incorrectos.");
        return;
    }

    sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
    window.location.href = usuario.esAdmin ? "admin-productos.html" : "index.html";
}

/* ---------------- Navbar según sesión ---------------- */

// Muestra "Hola, {nombre}" en vez de "Iniciar Sesión" si ya hay sesión activa
function actualizarNavbar() {
    const usuario = obtenerUsuarioActual();
    const zonaInvitado = document.getElementById("zona-invitado");
    const zonaUsuario = document.getElementById("zona-usuario");
    if (!zonaInvitado || !zonaUsuario) return;

    if (usuario) {
        zonaInvitado.classList.add("d-none");
        zonaUsuario.classList.remove("d-none");
        document.getElementById("nombre-usuario").textContent = usuario.nombre;

        const linkAdmin = document.getElementById("link-admin");
        if (linkAdmin) linkAdmin.classList.toggle("d-none", !usuario.esAdmin);
    } else {
        zonaInvitado.classList.remove("d-none");
        zonaUsuario.classList.add("d-none");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuarios();
    actualizarNavbar();

    document.getElementById("form-registro")?.addEventListener("submit", manejarRegistro);
    document.getElementById("form-login")?.addEventListener("submit", manejarLogin);
    document.getElementById("link-logout")?.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
    });
});
