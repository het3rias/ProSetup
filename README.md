# ProSetup — Tienda online (Evaluación Parcial 1, DSY1104)

Tienda online de componentes y periféricos gamer, desarrollada con **HTML5, CSS3 y JavaScript puro** (sin frameworks ni backend). Todo el "backend" es simulado con `localStorage`/`sessionStorage` del navegador.

## Cómo verlo

No necesita instalación. Basta con abrir `index.html` en el navegador, o levantar un servidor local simple, por ejemplo:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000/index.html
```

(Se recomienda un servidor local en vez de abrir el archivo directamente con doble clic, para evitar restricciones del navegador con `file://`.)

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | 1234 |
| Vendedor | vendedor@duoc.cl | 1234 |

También puedes crear una cuenta nueva desde **Registro** (queda como Cliente).

## Estructura del proyecto

```
ProSetup/
├── index.html              Página principal (tienda)
├── productos.html           Catálogo de productos
├── detalle-producto.html    Detalle de un producto + carrito
├── carrito.html              Carrito de compras
├── registro.html              Registro de usuario (Cliente)
├── login.html                  Inicio de sesión
├── nosotros.html               Sobre la tienda
├── blogs.html / detalle-blogs*.html   Blog de la tienda
├── contacto.html                Formulario de contacto
├── admin-home.html              Panel admin: dashboard
├── admin-productos.html         Panel admin: mantenedor de productos
├── admin-usuarios.html          Panel admin: mantenedor de usuarios
├── css/style.css                 Estilos propios
├── css/vendor/                     Bootstrap (vendorizado localmente)
├── js/auth.js                      Registro, login, sesión y roles
├── js/admin.js                     Lógica del panel de administración
├── js/productos.js                  Catálogo, detalle y carrito
├── js/contacto.js                    Validación del formulario de contacto
├── js/regiones.js                    Arreglo de regiones/comunas de Chile
└── img/                                 Imágenes del sitio
```

## Roles del sistema

- **Administrador**: acceso total (productos y usuarios).
- **Vendedor**: solo puede visualizar el listado y detalle de productos en el panel admin (no crea/edita/elimina, no ve usuarios).
- **Cliente**: solo accede a la tienda pública, no al panel de administración.

## Cómo subir este proyecto a GitHub

Este repositorio ya viene inicializado con `git init` y varios commits temáticos. Para publicarlo en un repositorio remoto público de GitHub:

1. Crea un repositorio nuevo y **vacío** en https://github.com/new (sin README, sin .gitignore, sin licencia, para no generar conflictos).
2. En la carpeta del proyecto, agrega el remoto y sube la rama:

   ```bash
   cd ProSetup
   git remote add origin https://github.com/<tu-usuario>/ProSetup.git
   git branch -M main
   git push -u origin main
   ```

3. Copia la URL del repositorio (debe quedar público) — esa es tu **"Enlace GitHub público del proyecto frontend"** para la entrega.
4. Para futuros cambios: `git add .`, `git commit -m "mensaje claro"`, `git push`.

Si trabajas en equipo, cada integrante debería clonar el repo, crear sus propios commits en una rama y hacer *pull request* hacia `main`, para que quede evidencia de la colaboración y distribución de tareas que pide la pauta.
