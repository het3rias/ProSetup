

function manejarContacto(event) {
    event.preventDefault();

    document.getElementById("error-c-nombre").textContent = "";
    document.getElementById("error-c-email").textContent = "";
    document.getElementById("error-c-comentario").textContent = "";

    const nombre = document.getElementById("c-nombre").value.trim();
    const email = document.getElementById("c-email").value.trim().toLowerCase();
    const comentario = document.getElementById("c-comentario").value.trim();

    let esValido = true;

    if (nombre.length < 3) {
        document.getElementById("error-c-nombre").textContent = "Ingresa tu nombre completo.";
        esValido = false;
    }

    // El correo es opcional, pero si lo escriben debe ser de un dominio permitido
    if (email !== "" && !/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)) {
        document.getElementById("error-c-email").textContent = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        esValido = false;
    }

    if (comentario.length < 5) {
        document.getElementById("error-c-comentario").textContent = "Cuéntanos un poco más (mínimo 5 caracteres).";
        esValido = false;
    }

    if (!esValido) return;

    alert("¡Gracias " + nombre + "! Recibimos tu mensaje y te contactaremos pronto.");
    document.getElementById("form-contacto").reset();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-contacto")?.addEventListener("submit", manejarContacto);
});
