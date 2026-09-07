/* ============================================
   ProSetup - Formulario de Contacto
   Reglas: nombre requerido (max 100), correo opcional (max 100,
   solo dominios permitidos si se ingresa), comentario requerido (max 500).
   ============================================ */

function manejarContacto(event) {
    event.preventDefault();

    document.getElementById("error-c-nombre").textContent = "";
    document.getElementById("error-c-email").textContent = "";
    document.getElementById("error-c-comentario").textContent = "";

    const nombre = document.getElementById("c-nombre").value.trim();
    const email = document.getElementById("c-email").value.trim().toLowerCase();
    const comentario = document.getElementById("c-comentario").value.trim();

    let esValido = true;

    if (nombre.length === 0) {
        document.getElementById("error-c-nombre").textContent = "El nombre es obligatorio.";
        esValido = false;
    } else if (nombre.length > 100) {
        document.getElementById("error-c-nombre").textContent = "Máximo 100 caracteres.";
        esValido = false;
    }

    // El correo es opcional, pero si lo escriben debe ser válido y de un dominio permitido
    if (email !== "") {
        if (email.length > 100) {
            document.getElementById("error-c-email").textContent = "Máximo 100 caracteres.";
            esValido = false;
        } else if (!/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)) {
            document.getElementById("error-c-email").textContent = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            esValido = false;
        }
    }

    if (comentario.length === 0) {
        document.getElementById("error-c-comentario").textContent = "El comentario es obligatorio.";
        esValido = false;
    } else if (comentario.length > 500) {
        document.getElementById("error-c-comentario").textContent = "Máximo 500 caracteres.";
        esValido = false;
    }

    if (!esValido) return;

    alert("¡Gracias " + nombre + "! Recibimos tu mensaje y te contactaremos pronto.");
    document.getElementById("form-contacto").reset();
    document.getElementById("c-comentario-contador").textContent = "0";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-contacto")?.addEventListener("submit", manejarContacto);

    const comentario = document.getElementById("c-comentario");
    const contador = document.getElementById("c-comentario-contador");
    comentario?.addEventListener("input", () => {
        contador.textContent = comentario.value.length;
    });
});
