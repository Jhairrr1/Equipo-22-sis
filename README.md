<<<<<<< HEAD
# Equipo-22-sis
=======
# Sistema Web Restaurante

Aplicación web moderna tipo dashboard para la gestión integral de un restaurante:
registro de pedidos, tablero de cocina, facturación y consultas. **100% frontend**,
sin backend — toda la información se persiste en `localStorage`.

## Descripción

Permite registrar pedidos por mesa, enviarlos a cocina, gestionar el flujo de
preparación, cerrar la cuenta de la mesa generando una factura y consultar
históricos de pedidos y facturas.

## Integrantes

- **Integrante Gabriela Quispe** — Módulo de Pedidos
- **Integrante Jeremyas Mendez** — Tablero de Cocina
- **Integrante Todos** — Facturación y cierre de cuenta
- **Integrante Pedro Cueva** — Dashboard, diseño general, README e integración

## Módulos

1. **Dashboard** — KPIs operativos (pedidos por estado, ventas del día, facturas) y accesos rápidos.
2. **Registro de Pedidos** — Crear pedidos con mesa, mozo, platos, cantidades, prioridad y observaciones. Validaciones completas, justificación obligatoria si es urgente. Cancelar o enviar a cocina.
3. **Tablero de Cocina** — Solo muestra pedidos `Enviado a cocina`, `En preparación` y `Listo para servir`. Filtros por estado/prioridad, alertas visuales para urgentes, alérgenos y observaciones destacadas.
4. **Facturación y Cierre de Cuenta** — Selecciona mesa, agrega pedidos entregados, calcula subtotal/IGV/descuento/total, valida método de pago (Efectivo, Tarjeta, Yape, Plin, Transferencia) y calcula vuelto.
5. **Consultas** — Histórico de pedidos y facturas con búsqueda y detalle.

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- lucide-react (íconos)
- sonner (notificaciones)
- localStorage (persistencia)

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:8080`. Los datos seed (platos, mesas, mozos) se cargan
automáticamente la primera vez.

Para reiniciar los datos: en la consola del navegador ejecuta
`localStorage.clear()` y recarga la página.

## Reglas de negocio destacadas

- Prioridad sugerida por tiempo total: <20min Normal · 20–40min Alta · >40min Urgente.
- Pedido urgente requiere justificación de mínimo 10 caracteres.
- Pedido cancelado nunca se factura.
- Una factura no puede generarse sin pedidos entregados de esa mesa.
- Un pedido no puede facturarse dos veces (queda marcado `facturado: true`).
- Descuento no negativo, no mayor al subtotal y con justificación si > 0.
- Pago en efectivo: monto recibido ≥ total, calcula vuelto.

## División del trabajo sugerida

| Integrante | Responsabilidad | Archivos principales |
|-----------|-----------------|----------------------|
| 1 | Pedidos | `src/pages/Pedidos.tsx` |
| 2 | Cocina | `src/pages/Cocina.tsx` |
| 3 | Facturación | `src/pages/Facturacion.tsx` |
| 4 | Dashboard, layout, diseño, README | `src/pages/Dashboard.tsx`, `src/components/restaurant/*`, `src/index.css`, `tailwind.config.ts` |

Componentes compartidos: `Layout`, `AppSidebar`, `StatusBadge`, `PriorityBadge`.
Modelo de datos y persistencia: `src/lib/types.ts`, `src/lib/storage.ts`, `src/data/seed.ts`.
>>>>>>> 2860e54 (avance)
