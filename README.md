# 🍽️ RestaurantePro

Sistema web de gestión para restaurantes desarrollado como proyecto del curso **Sistemas de Información**.

RestaurantePro permite administrar las operaciones principales de un restaurante mediante módulos conectados entre sí: **mesas, menú, pedidos, cocina, caja y reportes**.

El sistema fue desarrollado con **HTML5, CSS3 y JavaScript puro**, utilizando `localStorage` para almacenar la información directamente en el navegador.

---

## 📌 Información del proyecto

**Curso:** Sistemas de Información  
**Proyecto:** Sistema de Gestión para Restaurante  
**Nombre del sistema:** RestaurantePro  
**Tipo de sistema:** Sistema web administrativo  
**Tecnologías:** HTML, CSS, JavaScript, LocalStorage, Git y GitHub  

---

## 🎯 Objetivo del sistema

El objetivo principal de RestaurantePro es facilitar la gestión de las actividades diarias de un restaurante, permitiendo registrar, consultar y actualizar información de forma ordenada.

El sistema busca reemplazar procesos manuales como el control de mesas, registro de pedidos, seguimiento en cocina y cobro en caja, por una solución digital clara, rápida y funcional.

---

## 🧠 Problema identificado

En muchos restaurantes pequeños o medianos, el control de pedidos, mesas y pagos se realiza de forma manual. Esto puede generar problemas como:

- Pérdida de pedidos.
- Confusión en el estado de las mesas.
- Demoras en cocina.
- Falta de control en caja.
- Dificultad para revisar ventas o pagos.
- Errores al comunicar pedidos entre mozos, cocina y caja.

Por esa razón se propuso desarrollar un sistema web que permita centralizar la información y mejorar el flujo de atención.

---

## 💡 Solución propuesta

RestaurantePro es una aplicación web que organiza el proceso de atención de un restaurante desde el registro de mesas y platos hasta el cobro final del pedido.

El sistema permite que los módulos se comuniquen entre sí. Por ejemplo:

- Las mesas registradas se usan al crear pedidos.
- Los platos registrados en el menú se agregan a los pedidos.
- Los pedidos creados pasan al módulo de cocina.
- Los pedidos listos o entregados se cobran en caja.
- Los pagos registrados se muestran en reportes.

Esto permite evidenciar una integración real entre los módulos del sistema.

---

## 🚀 Funcionalidades principales

El sistema cuenta con las siguientes funcionalidades:

- Registro y administración de mesas.
- Registro y administración de platos del menú.
- Creación de pedidos.
- Selección de mesa para cada pedido.
- Selección de platos dentro del pedido.
- Cálculo automático del total.
- Cambio de estado de los pedidos.
- Visualización de pedidos en cocina.
- Registro de pagos en caja.
- Visualización de reportes.
- Navegación mediante menú lateral.
- Interfaz ordenada y responsiva.
- Almacenamiento de datos en `localStorage`.

---

## 🧩 Módulos del sistema

### 1. Dashboard

El módulo Dashboard muestra una vista general del sistema. Permite visualizar indicadores importantes como pedidos, ventas, mesas y actividad reciente.

Este módulo ayuda al usuario a tener un resumen rápido del estado del restaurante.

---

### 2. Mesas

El módulo Mesas permite registrar y administrar las mesas del restaurante.

Cada mesa puede tener información como:

- Número de mesa.
- Capacidad de personas.
- Estado de la mesa.

Los estados principales son:

- Disponible.
- Ocupada.
- Reservada.
- En limpieza.

Este módulo es importante porque los pedidos se crean seleccionando una mesa registrada.

---

### 3. Menú

El módulo Menú permite registrar los platos disponibles del restaurante.

Cada plato puede tener:

- Nombre.
- Categoría.
- Descripción.
- Precio.
- Stock.
- Estado.
- Ícono o imagen representativa.

Las categorías pueden ser, por ejemplo:

- Entradas.
- Fondos.
- Bebidas.
- Postres.

Este módulo se integra con Pedidos, ya que los platos registrados son los que se pueden agregar al pedido.

---

### 4. Pedidos

El módulo Pedidos permite crear y administrar pedidos de los clientes.

Para crear un pedido se debe:

1. Seleccionar una mesa.
2. Elegir platos del menú.
3. Agregar cantidades.
4. Confirmar el pedido.

El sistema calcula automáticamente el total del pedido y lo registra con un estado inicial.

Los estados del pedido pueden ser:

- Pendiente.
- En preparación.
- Listo.
- Entregado.
- Pagado.

Este módulo representa una parte principal del flujo del sistema, porque conecta Mesas, Menú, Cocina y Caja.

---

### 5. Cocina

El módulo Cocina muestra los pedidos que deben ser preparados.

Los pedidos se visualizan según su estado:

- Pendientes.
- En preparación.
- Listos.

Desde este módulo se puede cambiar el estado del pedido para indicar el avance del proceso de preparación.

Este módulo permite organizar el trabajo de cocina y evitar confusiones con los pedidos.

---

### 6. Caja

El módulo Caja permite registrar el pago de los pedidos.

Cuando un pedido está listo o entregado, puede pasar a caja para ser cobrado.

El sistema permite registrar métodos de pago como:

- Efectivo.
- Tarjeta.
- Yape.
- Plin.

Después de registrar el pago, el pedido cambia su estado a pagado y la información queda disponible para los reportes.

---

### 7. Reportes

El módulo Reportes permite visualizar información resumida del sistema.

Puede mostrar información como:

- Total recaudado.
- Cantidad de pedidos.
- Métodos de pago utilizados.
- Platos más vendidos.
- Historial de pagos.
- Pedidos por estado.

Este módulo ayuda a analizar la actividad del restaurante.

---

## 🔄 Flujo general del sistema

El flujo principal del sistema es el siguiente:

1. El usuario registra las mesas del restaurante.
2. El usuario registra los platos disponibles en el menú.
3. Se crea un pedido seleccionando una mesa.
4. Se agregan platos al pedido.
5. El pedido se guarda con estado pendiente.
6. El pedido aparece en el módulo de cocina.
7. Cocina actualiza el estado del pedido.
8. Cuando el pedido está listo o entregado, pasa al módulo de caja.
9. Caja registra el pago.
10. Reportes muestra la información de ventas, pagos y pedidos.

Este flujo demuestra que los módulos se encuentran integrados y que la información registrada en un módulo se utiliza en los demás.

---

## 🔗 Integración entre módulos

La integración del sistema se evidencia de la siguiente forma:

| Módulo origen | Módulo relacionado | Integración |
|---|---|---|
| Mesas | Pedidos | Las mesas registradas se seleccionan al crear un pedido. |
| Menú | Pedidos | Los platos registrados se agregan a los pedidos. |
| Pedidos | Cocina | Los pedidos creados aparecen para su preparación. |
| Cocina | Caja | Los pedidos listos o entregados pueden ser cobrados. |
| Caja | Reportes | Los pagos registrados se muestran en los reportes. |
| Pedidos | Reportes | Los pedidos se usan para generar indicadores. |

---

## 👥 Integrantes del equipo

| Integrante | Módulo asignado |
|---|---|
| Gabriela | Gestión de mesas |
| Jeremyas | Gestión de menú |
| Pedro | Pedidos y caja |

---

## 🧑‍💻 Responsabilidades por integrante

### Gabriela

Gabriela desarrolló el módulo de **Mesas**, encargado de registrar y administrar las mesas del restaurante.

Archivos principales:

```txt
mesas.html
js/mesas.js