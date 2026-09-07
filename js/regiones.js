/* ============================================
   ProSetup - Arreglo de Regiones y Comunas de Chile
   ============================================
   Este archivo es el "arreglo de JS complementario" que piden las
   instrucciones para completar los select de Región y Comuna en los
   formularios de Registro de usuario y Mantenedor de Usuario.

   Estructura: un arreglo de objetos { region, comunas: [...] }.
   No pretende ser 100% exhaustivo (Chile tiene 346 comunas), pero
   cubre las 16 regiones con sus comunas principales.
   ============================================ */

const REGIONES_CHILE = [
    {
        region: "Región de Arica y Parinacota",
        comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
        region: "Región de Tarapacá",
        comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
        region: "Región de Antofagasta",
        comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal", "San Pedro de Atacama"]
    },
    {
        region: "Región de Atacama",
        comunas: ["Copiapó", "Caldera", "Chañaral", "Vallenar", "Huasco", "Diego de Almagro"]
    },
    {
        region: "Región de Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña", "Andacollo", "Salamanca"]
    },
    {
        region: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes", "Quillota", "Casablanca", "La Ligua"]
    },
    {
        region: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "La Florida", "Ñuñoa", "San Bernardo", "Vitacura", "Recoleta", "Independencia", "La Reina"]
    },
    {
        region: "Región del Libertador Gral. Bernardo O'Higgins",
        comunas: ["Rancagua", "San Fernando", "Rengo", "Santa Cruz", "Pichilemu", "Machalí"]
    },
    {
        region: "Región del Maule",
        comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "San Javier"]
    },
    {
        region: "Región de Ñuble",
        comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Quirihue"]
    },
    {
        region: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "San Pedro de la Paz", "Chiguayante", "Lota"]
    },
    {
        region: "Región de La Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Pucón", "Victoria"]
    },
    {
        region: "Región de Los Ríos",
        comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Los Lagos"]
    },
    {
        region: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón", "Chonchi", "Frutillar"]
    },
    {
        region: "Región de Aysén",
        comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"]
    },
    {
        region: "Región de Magallanes y de la Antártica Chilena",
        comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Puerto Williams"]
    }
];

// Llena un <select> de regiones con las opciones del arreglo de arriba
function cargarSelectRegiones(idSelectRegion) {
    const select = document.getElementById(idSelectRegion);
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccione la región --</option>';
    REGIONES_CHILE.forEach(r => {
        const opcion = document.createElement("option");
        opcion.value = r.region;
        opcion.textContent = r.region;
        select.appendChild(opcion);
    });
}

// Cuando cambia la región seleccionada, vuelve a llenar el select de comunas
function cargarComunasPorRegion(idSelectRegion, idSelectComuna) {
    const selectRegion = document.getElementById(idSelectRegion);
    const selectComuna = document.getElementById(idSelectComuna);
    if (!selectRegion || !selectComuna) return;

    const regionSeleccionada = REGIONES_CHILE.find(r => r.region === selectRegion.value);

    if (!regionSeleccionada) {
        selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
        selectComuna.disabled = true;
        return;
    }

    selectComuna.disabled = false;
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>' +
        regionSeleccionada.comunas.map(c => `<option value="${c}">${c}</option>`).join("");
}

// Conecta un par región/comuna: llena las regiones y escucha el evento "change"
function inicializarSelectRegionComuna(idSelectRegion, idSelectComuna) {
    const selectRegion = document.getElementById(idSelectRegion);
    if (!selectRegion) return;

    cargarSelectRegiones(idSelectRegion);
    document.getElementById(idSelectComuna).disabled = true;

    selectRegion.addEventListener("change", () => {
        cargarComunasPorRegion(idSelectRegion, idSelectComuna);
    });
}
