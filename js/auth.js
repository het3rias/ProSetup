/* ============================================
   ProSetup - Registro, Login, sesión y roles
   ============================================
   Guardamos los usuarios en localStorage (clave "usuariosDB")
   y la sesión activa en sessionStorage (clave "usuarioActual").

   sessionStorage se borra solo al cerrar el navegador;
   localStorage se queda guardado siempre hasta que lo borres.

   Cada usuario tiene un "tipoUsuario": Administrador, Vendedor o Cliente.
   - Administrador: acceso total al sistema (tienda + administración).
   - Vendedor: solo puede ver el listado y detalle de productos en el
     panel administrativo (no puede gestionar usuarios ni crear/editar/eliminar).
   - Cliente: solo puede acceder a la tienda (no entra al panel admin).

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

/* ---------------- Validación de RUN chileno ---------------- */
// Regla del enunciado: requerido, sin puntos ni guion (ej: 19011022K),
// largo entre 7 y 9 caracteres, y el dígito verificador debe ser correcto.
function formatoRunValido(run) {
    // No debe contener puntos ni guiones
    if (/[.\-]/.test(run)) return false;
    // Solo dígitos y, al final, opcionalmente K/k
    return /^[0-9]+[0-9kK]$/.test(run) && run.length >= 7 && run.length <= 9;
}

function calcularDigitoVerificador(cuerpo) {
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = (multiplo === 7) ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

// Devuelve true/false según si el RUN (formato y dígito verificador) es válido
function validarRun(run) {
    if (!formatoRunValido(run)) return false;
    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1).toUpperCase();
    return dv === calcularDigitoVerificador(cuerpo);
}

/* ---------------- Base de datos de usuarios ---------------- */

// Crea una cuenta de administrador y una de vendedor de prueba la primera vez que se abre el sitio
function inicializarUsuarios() {
    if (!localStorage.getItem("usuariosDB")) {
        const admin = {
            run: "190110222", nombre: "Admin", apellidos: "ProSetup",
            email: "admin@duoc.cl", password: "1234", telefono: "",
            fechaNacimiento: "", tipoUsuario: "Administrador",
            region: "Región Metropolitana de Santiago", comuna: "Santiago",
            direccion: "Av. Siempre Viva 123"
        };
        const vendedor = {
            run: "18057784K", nombre: "Vero", apellidos: "Vendedora",
            email: "vendedor@duoc.cl", password: "1234", telefono: "",
            fechaNacimiento: "", tipoUsuario: "Vendedor",
            region: "Región Metropolitana de Santiago", comuna: "Maipú",
            direccion: "Calle Comercio 456"
        };
        localStorage.setItem("usuariosDB", JSON.stringify([admin, vendedor]));
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

function actualizarSesionSiCorresponde(usuarioActualizado) {
    const actual = obtenerUsuarioActual();
    if (actual && actual.email === usuarioActualizado.email) {
        sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
}

// Muestra un mensaje de error debajo de un campo del formulario
function mostrarError(idCampo, mensaje) {
    const el = document.getElementById("error-" + idCampo);
    if (el) el.textContent = mensaje;
}

function limpiarErrores(idsCampos) {
    idsCampos.forEach(id => mostrarError(id, ""));
}

/* ---------------- Registro (= alta de usuario tipo Cliente) ---------------- */
// El enunciado indica que "el registro de usuarios es lo mismo que crear
// un usuario en el administrador" (mismas reglas de negocio), con la
// diferencia de que el select "Tipo de Usuario" solo existe en la vista
// administrativa: en el registro público el tipo siempre queda en "Cliente".

function validarDatosUsuario(datos, prefijo, { esEdicion = false, emailOriginal = null } = {}) {
    let esValido = true;

    if (datos.run.length === 0) {
        mostrarError(prefijo + "run", "El RUN es obligatorio.");
        esValido = false;
    } else if (!validarRun(datos.run)) {
        mostrarError(prefijo + "run", "RUN inválido. Sin puntos ni guion, ej: 19011022K.");
        esValido = false;
    } else {
        const yaExiste = obtenerUsuarios().some(u => u.run === datos.run && u.email !== emailOriginal);
        if (yaExiste) {
            mostrarError(prefijo + "run", "Ya existe un usuario registrado con este RUN.");
            esValido = false;
        }
    }

    if (datos.nombre.length === 0) {
        mostrarError(prefijo + "nombre", "El nombre es obligatorio.");
        esValido = false;
    } else if (datos.nombre.length > 50) {
        mostrarError(prefijo + "nombre", "Máximo 50 caracteres.");
        esValido = false;
    }

    if (datos.apellidos.length === 0) {
        mostrarError(prefijo + "apellidos", "Los apellidos son obligatorios.");
        esValido = false;
    } else if (datos.apellidos.length > 100) {
        mostrarError(prefijo + "apellidos", "Máximo 100 caracteres.");
        esValido = false;
    }

    if (datos.email.length === 0) {
        mostrarError(prefijo + "email", "El correo es obligatorio.");
        esValido = false;
    } else if (datos.email.length > 100) {
        mostrarError(prefijo + "email", "Máximo 100 caracteres.");
        esValido = false;
    } else if (!REGEX_CORREO_PERMITIDO.test(datos.email)) {
        mostrarError(prefijo + "email", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        esValido = false;
    } else {
        const emailDuplicado = obtenerUsuarios().some(u => u.email === datos.email && u.email !== emailOriginal);
        if (emailDuplicado) {
            mostrarError(prefijo + "email", "Ya existe una cuenta con este correo.");
            esValido = false;
        }
    }

    if (!esEdicion || datos.password !== "") {
        if (datos.password.length < 4 || datos.password.length > 10) {
            mostrarError(prefijo + "password", "La contraseña debe tener entre 4 y 10 caracteres.");
            esValido = false;
        }
        if (datos.confirmar !== datos.password) {
            mostrarError(prefijo + "confirmar", "Las contraseñas no coinciden.");
            esValido = false;
        }
    }

    if (datos.direccion.length === 0) {
        mostrarError(prefijo + "direccion", "La dirección es obligatoria.");
        esValido = false;
    } else if (datos.direccion.length > 300) {
        mostrarError(prefijo + "direccion", "Máximo 300 caracteres.");
        esValido = false;
    }

    if (datos.region.length === 0) {
        mostrarError(prefijo + "region", "Selecciona una región.");
        esValido = false;
    }
    if (datos.comuna.length === 0) {
        mostrarError(prefijo + "comuna", "Selecciona una comuna.");
        esValido = false;
    }

    return esValido;
}

// Lee los valores actuales del formulario de registro (o de edición en el admin,
// que comparte los mismos nombres de campo con prefijo "reg-"/"u-").
function leerDatosFormularioUsuario(prefijo) {
    return {
        run: document.getElementById(prefijo + "run").value.trim().toUpperCase(),
        nombre: document.getElementById(prefijo + "nombre").value.trim(),
        apellidos: document.getElementById(prefijo + "apellidos").value.trim(),
        email: document.getElementById(prefijo + "email").value.trim().toLowerCase(),
        password: document.getElementById(prefijo + "password").value,
        confirmar: document.getElementById(prefijo + "confirmar").value,
        telefono: document.getElementById(prefijo + "telefono").value.trim(),
        fechaNacimiento: document.getElementById(prefijo + "fecha-nacimiento").value,
        direccion: document.getElementById(prefijo + "direccion").value.trim(),
        region: document.getElementById(prefijo + "region").value,
        comuna: document.getElementById(prefijo + "comuna").value
    };
}

// Valida el formulario de registro "en vivo" (sin enviar el formulario),
// para mostrar sugerencias y errores apenas el usuario cambia un campo.
function validarRegistroEnVivo() {
    const datos = leerDatosFormularioUsuario("reg-");
    validarDatosUsuario(datos, "reg-");
}

function manejarRegistro(event) {
    event.preventDefault();
    const campos = ["run", "nombre", "apellidos", "email", "password", "confirmar", "telefono", "direccion", "region", "comuna"];
    limpiarErrores(campos.map(c => "reg-" + c));

    const datos = leerDatosFormularioUsuario("reg-");

    if (!validarDatosUsuario(datos, "reg-")) return;

    const nuevoUsuario = {
        run: datos.run, nombre: datos.nombre, apellidos: datos.apellidos,
        email: datos.email, password: datos.password, telefono: datos.telefono,
        fechaNacimiento: datos.fechaNacimiento, tipoUsuario: "Cliente",
        region: datos.region, comuna: datos.comuna, direccion: datos.direccion
    };

    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    sessionStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
    window.location.href = "index.html";
}

// Validación en vivo del login: da feedback apenas el usuario sale del campo,
// sin esperar a que apriete "Ingresar".
function validarLoginEnVivo(campo) {
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (campo === "email") {
        if (email.length === 0) mostrarError("email", "");
        else if (email.length > 100) mostrarError("email", "Máximo 100 caracteres.");
        else if (!REGEX_CORREO_PERMITIDO.test(email)) mostrarError("email", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        else mostrarError("email", "");
    }
    if (campo === "password") {
        if (password.length === 0) mostrarError("password", "");
        else if (password.length < 4 || password.length > 10) mostrarError("password", "La contraseña debe tener entre 4 y 10 caracteres.");
        else mostrarError("password", "");
    }
}

/* ---------------- Login ---------------- */

function manejarLogin(event) {
    event.preventDefault();
    limpiarErrores(["email", "password"]);

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (email.length === 0) {
        mostrarError("email", "El correo es obligatorio.");
        return;
    }
    if (email.length > 100) {
        mostrarError("email", "Máximo 100 caracteres.");
        return;
    }
    if (!REGEX_CORREO_PERMITIDO.test(email)) {
        mostrarError("email", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return;
    }
    if (password.length < 4 || password.length > 10) {
        mostrarError("password", "La contraseña debe tener entre 4 y 10 caracteres.");
        return;
    }

    const usuario = obtenerUsuarios().find(u => u.email === email);

    if (!usuario || usuario.password !== password) {
        mostrarError("password", "Correo o contraseña incorrectos.");
        return;
    }

    sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
    window.location.href = (usuario.tipoUsuario === "Cliente") ? "index.html" : "admin-home.html";
}

/* ---------------- Navbar según sesión y rol ---------------- */

// Muestra "Hola, {nombre}" en vez de "Iniciar Sesión" si ya hay sesión activa,
// y solo muestra el enlace "Admin" si el rol tiene acceso al panel (no Cliente).
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
        if (linkAdmin) linkAdmin.classList.toggle("d-none", usuario.tipoUsuario === "Cliente");
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

    if (document.getElementById("reg-region") && document.getElementById("reg-comuna")) {
        inicializarSelectRegionComuna("reg-region", "reg-comuna");
    }

    // Validación en tiempo real: apenas el usuario sale de un campo del
    // registro, se revisa ese formulario completo y se muestran sugerencias.
    if (document.getElementById("form-registro")) {
        ["run", "nombre", "apellidos", "email", "password", "confirmar", "telefono", "direccion", "region", "comuna"]
            .forEach(campo => {
                document.getElementById("reg-" + campo)?.addEventListener("blur", validarRegistroEnVivo);
            });
        document.getElementById("reg-password")?.addEventListener("input", validarRegistroEnVivo);
        document.getElementById("reg-confirmar")?.addEventListener("input", validarRegistroEnVivo);
    }

    // Validación en tiempo real del login
    if (document.getElementById("form-login")) {
        document.getElementById("login-email")?.addEventListener("blur", () => validarLoginEnVivo("email"));
        document.getElementById("login-password")?.addEventListener("input", () => validarLoginEnVivo("password"));
    }
});
