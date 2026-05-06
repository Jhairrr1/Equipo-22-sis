# 🍽️ RestaurantePro

Sistema web profesional para gestión integral de restaurantes. Esta versión inicia sin login y sin datos demo para que registres todo desde cero.
HTML5 + CSS3 + JavaScript puro · sin frameworks · datos en `localStorage`.

## 🚀 Cómo usar

1. Descomprime el ZIP.
2. Abre `index.html` en tu navegador (doble clic). Entrará directo al Dashboard, sin pedir login.
3. Te llevará a la pantalla de login.

## 🔑 Credenciales de prueba

| Rol            | Email                       | Contraseña |
|----------------|-----------------------------|------------|
| Administrador  | admin@restaurante.com       | 123456     |
| Mozo           | mozo@restaurante.com        | 123456     |
| Cocinero       | cocina@restaurante.com      | 123456     |
| Cajero         | caja@restaurante.com        | 123456     |

> Tip: en la pantalla de login puedes hacer **clic en cualquier credencial**
> para autocompletarla.

## 📦 Módulos

- **Dashboard** — KPIs, top platos, ingresos por método, últimos pedidos.
- **Mesas** — CRUD + 4 estados visuales (Disponible / Ocupada / Reservada / Limpieza).
- **Menú** — CRUD de platos con búsqueda y filtro por categoría.
- **Pedidos** — Crea pedidos, agrega platos al carrito, calcula totales.
- **Cocina** — Tablero Kanban (Pendiente → En preparación → Listo).
- **Caja** — Cobro con Efectivo / Tarjeta / Yape / Plin + comprobante imprimible.
- **Reportes** — Ventas, métodos de pago, top platos, historial.

## 🔐 Permisos por rol

| Módulo     | Admin | Mozo | Cocinero | Cajero |
|------------|:-----:|:----:|:--------:|:------:|
| Dashboard  | ✅    | ✅   | ✅       | ✅     |
| Mesas      | ✅    | ✅   |          |        |
| Menú       | ✅    |      |          |        |
| Pedidos    | ✅    | ✅   |          |        |
| Cocina     | ✅    |      | ✅       |        |
| Caja       | ✅    |      |          | ✅     |
| Reportes   | ✅    |      |          | ✅     |

## 🗂️ Estructura

```
RestaurantePro/
├─ index.html            (redirección)
├─ login.html
├─ dashboard.html
├─ mesas.html
├─ menu.html
├─ pedidos.html
├─ cocina.html
├─ caja.html
├─ reportes.html
├─ css/styles.css        (design system completo)
└─ js/
   ├─ data.js            (seed + helpers de localStorage)
   ├─ app.js             (sidebar, header, toasts, modales)
   ├─ auth.js            (login)
   ├─ dashboard.js
   ├─ mesas.js
   ├─ menu.js
   ├─ pedidos.js
   ├─ cocina.js
   ├─ caja.js
   └─ reportes.js
```

## ♻️ Reiniciar datos de demo

Abre la consola del navegador (F12) y ejecuta:
```js
DB.reset(); location.reload();
```

## 🎨 Diseño

- Sidebar oscuro fijo + header sticky.
- Paleta corporativa: azul `#1e40af` + dorado `#f59e0b` sobre fondos claros.
- Tipografía Inter, cards con sombras suaves, badges, animaciones sutiles.
- Totalmente responsive (laptop / tablet / móvil).
- Soporte de impresión para comprobantes y reportes.


## ✅ Cambios aplicados

- El sistema ya no pide login.
- `index.html` entra directo a `dashboard.html`.
- Todas las páginas crean una sesión demo automática como **Administrador**.
- El botón lateral ahora reinicia los datos demo en lugar de cerrar sesión.
- Se mejoraron cards, tablas, modales, botones, sidebar, header y estados visuales.


## 🧼 Datos iniciales

Esta versión inicia vacía: no hay mesas, platos, pedidos ni pagos. Registra primero las mesas y platos para poder crear pedidos. El botón **Limpiar datos** borra todo lo registrado y vuelve a dejar el sistema vacío.
