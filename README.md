# RestaurantePro

Sistema web de gestión de restaurante sin login, con módulos separados por carpeta y datos en `localStorage`.

## Módulos

- `modules/dashboard`
- `modules/mesas`
- `modules/menu`
- `modules/pedidos`
- `modules/cocina`
- `modules/caja`
- `modules/reportes`

## Flujo de prueba

1. Abrir `index.html`.
2. Crear una mesa en Mesas.
3. Crear un plato activo con stock mayor a 0 en Menú.
4. Crear un pedido en Pedidos usando la mesa y los platos registrados.
5. Cambiar estado en Cocina.
6. Cobrar en Caja.
7. Ver resultados en Dashboard y Reportes.

## Validaciones incluidas

- No permite registrar mesas con el mismo número.
- No permite registrar platos con el mismo nombre.
- Valida precios, stock y campos obligatorios.
- No permite crear pedidos sin mesas, sin platos o con stock insuficiente.
- Descuenta stock al confirmar pedidos.
- No permite cobrar pedidos que no estén listos o entregados.
