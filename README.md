# 🍽️ RestaurantePro

<<<<<<< HEAD
Sistema web de gestión para restaurantes desarrollado como proyecto del curso **Sistemas de Información**.

RestaurantePro permite administrar de manera digital las operaciones principales de un restaurante: **mesas, menú, pedidos, cocina, caja y reportes**.  
El sistema fue desarrollado con **HTML5, CSS3 y JavaScript puro**, utilizando `localStorage` para almacenar la información en el navegador.

---

## 📌 Información del proyecto

**Curso:** Sistemas de Información  
**Proyecto:** Sistema de Gestión para Restaurante  
**Nombre del sistema:** RestaurantePro  
**Tipo de sistema:** Sistema web administrativo  
**Tecnologías utilizadas:** HTML5, CSS3, JavaScript, LocalStorage, Git y GitHub  

---

## 🎯 Objetivo del sistema

El objetivo de RestaurantePro es facilitar la gestión de las actividades diarias de un restaurante mediante una aplicación web clara, funcional y ordenada.

El sistema permite registrar, consultar, actualizar estados y completar el flujo principal de atención de un restaurante: desde la creación de mesas y platos hasta el registro de pedidos, preparación en cocina, cobro en caja y visualización de reportes.

---

## 🧠 Problema identificado

En muchos restaurantes pequeños o medianos, el control de mesas, pedidos, cocina y pagos se realiza manualmente. Esto puede generar errores como:

- Registro duplicado de mesas.
- Confusión en el estado de los pedidos.
- Pérdida de información.
- Demoras en la comunicación con cocina.
- Falta de control de pagos.
- Dificultad para revisar ventas o reportes.
- Errores al calcular totales.

Por esta razón se desarrolló un sistema web que centraliza la información y permite mejorar el flujo operativo del restaurante.

---

## 💡 Solución propuesta

RestaurantePro organiza el proceso de atención de un restaurante en módulos conectados entre sí.

El sistema permite que la información registrada en un módulo sea utilizada por otros. Por ejemplo:

- Las mesas registradas se utilizan al crear pedidos.
- Los platos registrados en el menú se agregan a los pedidos.
- Los pedidos creados pasan al módulo de cocina.
- Los pedidos listos o entregados pueden ser cobrados en caja.
- Los pagos registrados se visualizan en reportes.

Esto permite demostrar una integración real entre módulos.

---

## 🚀 Funcionalidades principales

- Gestión de mesas.
- Gestión de platos del menú.
- Registro de pedidos.
- Selección de mesa para cada pedido.
- Selección de platos registrados en el menú.
- Cálculo automático del total.
- Control de stock.
- Cambio de estado de pedidos.
- Visualización de pedidos en cocina.
- Registro de pagos en caja.
- Visualización de reportes.
- Navegación mediante menú lateral.
- Interfaz moderna y responsiva.
- Almacenamiento local mediante `localStorage`.
- Validaciones para evitar errores comunes.

---

## ✅ Validaciones implementadas

El sistema incluye validaciones para mejorar la funcionalidad y evitar errores frecuentes.

### Mesas

- No permite registrar mesas con el mismo número.
- Valida que el número de mesa sea obligatorio.
- Valida que la capacidad sea mayor a cero.
- Permite controlar el estado de la mesa.

### Menú

- No permite registrar platos con el mismo nombre.
- Valida que el nombre del plato sea obligatorio.
- Valida que el precio sea mayor a cero.
- Valida que el stock no sea negativo.
- Permite activar o desactivar platos.

### Pedidos

- No permite crear pedidos sin seleccionar una mesa.
- No permite crear pedidos sin agregar platos.
- Solo muestra platos activos del menú.
- Valida stock disponible antes de agregar platos.
- Descuenta stock al confirmar el pedido.
- Cambia el estado de la mesa a ocupada al crear un pedido.

### Cocina

- Solo muestra pedidos pendientes, en preparación o listos.
- Permite cambiar el estado del pedido según el avance.
- Evita confusión en el flujo de preparación.

### Caja

- Solo permite cobrar pedidos listos o entregados.
- Registra el método de pago.
- Cambia el estado del pedido a pagado.
- Registra el pago para reportes.

---

## 🧩 Módulos del sistema

### 1. Dashboard

El módulo Dashboard muestra un resumen general del sistema, incluyendo indicadores importantes como pedidos, ventas, mesas y actividad reciente.

Este módulo permite tener una vista rápida del estado actual del restaurante.

---

### 2. Mesas

El módulo Mesas permite registrar y administrar las mesas del restaurante.

Cada mesa cuenta con:

- Número de mesa.
- Capacidad de personas.
- Estado de la mesa.

Estados disponibles:

- Disponible.
- Ocupada.
- Reservada.
- En limpieza.

Este módulo es importante porque las mesas registradas son utilizadas al crear pedidos.

---

### 3. Menú

El módulo Menú permite registrar y administrar los platos disponibles del restaurante.

Cada plato contiene:

- Nombre.
- Categoría.
- Descripción.
- Precio.
- Stock.
- Estado.
- Ícono representativo.

Categorías sugeridas:

- Entradas.
- Fondos.
- Bebidas.
- Postres.

Este módulo se conecta con Pedidos, ya que los platos registrados y activos son los que aparecen para ser seleccionados en un pedido.

---

### 4. Pedidos

El módulo Pedidos permite crear y administrar pedidos de clientes.

Para crear un pedido se debe:

1. Seleccionar una mesa registrada.
2. Elegir platos activos del menú.
3. Agregar cantidades.
4. Confirmar el pedido.

El sistema calcula automáticamente el total del pedido y lo registra con estado inicial **Pendiente**.

Estados del pedido:

- Pendiente.
- En preparación.
- Listo.
- Entregado.
- Pagado.

Este módulo conecta Mesas, Menú, Cocina y Caja.

---

### 5. Cocina

El módulo Cocina muestra los pedidos que deben ser preparados.

Los pedidos se organizan según su estado:

- Pendientes.
- En preparación.
- Listos.

Desde este módulo se puede actualizar el estado del pedido para reflejar el avance de preparación.

---

### 6. Caja

El módulo Caja permite registrar el pago de pedidos.

Cuando un pedido está listo o entregado, puede ser cobrado en caja.

Métodos de pago disponibles:

- Efectivo.
- Tarjeta.
- Yape.
- Plin.

Después del pago, el pedido cambia a estado **Pagado** y el pago queda registrado para reportes.

---

### 7. Reportes

El módulo Reportes muestra información resumida del sistema.

Puede visualizar:

- Total recaudado.
- Cantidad de pedidos.
- Métodos de pago utilizados.
- Platos más vendidos.
- Historial de pagos.
- Pedidos por estado.

Este módulo permite analizar la actividad del restaurante.

---

## 🔄 Flujo general del sistema

El flujo principal del sistema es:

```txt
Mesas → Menú → Pedidos → Cocina → Caja → Reportes
=======
Sistema web para gestión de restaurante hecho con **HTML, CSS y JavaScript puro**.

## ✅ Características

- Sin login: entra directo al dashboard.
- Módulos separados por carpeta.
- Cada módulo tiene su propio **HTML + CSS + JS**.
- Datos guardados en `localStorage`.
- Validaciones comunes incluidas.
- Pantalla completa y layout responsive.

## 🧩 Módulos

### Gabriela — Mesas

```txt
modulos/mesas/mesas.html
modulos/mesas/mesas.css
modulos/mesas/mesas.js
```

### Jeremyas — Menú

```txt
modulos/menu/menu.html
modulos/menu/menu.css
modulos/menu/menu.js
```

### Pedro — Pedidos y Caja

```txt
modulos/pedidos/pedidos.html
modulos/pedidos/pedidos.css
modulos/pedidos/pedidos.js
modulos/caja/caja.html
modulos/caja/caja.css
modulos/caja/caja.js
```

## 📁 Estructura

```txt
RestaurantePro/
├─ index.html
├─ README.md
├─ css/styles.css
├─ js/app.js
├─ js/data.js
└─ modulos/
   ├─ mesas/mesas.html mesas.css mesas.js
   ├─ menu/menu.html menu.css menu.js
   ├─ pedidos/pedidos.html pedidos.css pedidos.js
   ├─ cocina/cocina.html cocina.css cocina.js
   ├─ caja/caja.html caja.css caja.js
   ├─ dashboard/dashboard.html dashboard.css dashboard.js
   └─ reportes/reportes.html reportes.css reportes.js
```

## ▶️ Cómo usar

1. Abre `index.html`.
2. Registra mesas en **Mesas**.
3. Registra platos activos con stock en **Menú**.
4. Crea pedidos en **Pedidos**.
5. Cambia estados en **Cocina**.
6. Cobra pedidos listos o entregados en **Caja**.
7. Revisa métricas en **Reportes**.

## 🔄 Flujo

```txt
Mesas → Menú → Pedidos → Cocina → Caja → Reportes
```

## ✅ Validaciones

- No permite mesas duplicadas.
- No permite platos duplicados.
- No permite precios menores o iguales a cero.
- No permite stock negativo.
- No permite pedidos sin mesa o sin platos.
- No permite agregar platos sin stock.
- No permite cobrar pedidos que no estén listos o entregados.

## 🌿 Git recomendado

```bash
# Gabriela
git add modulos/mesas/mesas.html modulos/mesas/mesas.css modulos/mesas/mesas.js
git commit -m "Agregar modulo completo de mesas"

# Jeremyas
git add modulos/menu/menu.html modulos/menu/menu.css modulos/menu/menu.js
git commit -m "Agregar modulo completo de menu"

# Pedro
git add modulos/pedidos modulos/caja
git commit -m "Agregar modulos completos de pedidos y caja"
```
>>>>>>> e88c65a (cambio final)
