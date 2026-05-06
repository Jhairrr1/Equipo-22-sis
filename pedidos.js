let cart = [];

function renderPedidos() {
  const pedidos = DB.get(DB_KEYS.PEDIDOS) || [];
  const contenedor = document.getElementById('pedidosTable');

  if (!contenedor) return;

  if (pedidos.length === 0) {
    contenedor.innerHTML = `
      <div style="text-align:center; padding:50px; color:var(--text-2);">
        <h3 style="margin-bottom:8px;">No hay pedidos registrados</h3>
        <p>Presiona “Nuevo pedido” para crear uno.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = `
    <table class="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Mesa</th>
          <th>Items</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${[...pedidos].reverse().map(p => `
          <tr>
            <td><strong>#${p.id}</strong></td>
            <td>Mesa ${p.mesaId}</td>
            <td>${p.items.length} platos</td>
            <td><strong>${fmt(p.total)}</strong></td>
            <td>${estadoBadge(p.estado)}</td>
            <td style="font-size:12px; color:var(--text-3);">${shortDate(p.fecha)}</td>
            <td>
              <button class="btn btn-sm btn-outline" onclick="verPedido(${p.id})">Ver</button>
              <button class="btn btn-sm btn-outline" onclick="cambiarEstadoPedido(${p.id})">Estado</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${p.id})">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function openNuevoPedido() {
  cart = [];

  const mesas = DB.get(DB_KEYS.MESAS) || [];
  const menu = DB.get(DB_KEYS.MENU) || [];

  if (mesas.length === 0) {
    toast('error', 'No hay mesas', 'Primero crea una mesa en el módulo Mesas.');
    return;
  }

  if (menu.length === 0) {
    toast('error', 'No hay platos', 'Primero crea platos en el módulo Menú.');
    return;
  }

  const mesasDisponibles = mesas.filter(m =>
    m.estado === 'Disponible' || m.estado === 'Ocupada'
  );

  if (mesasDisponibles.length === 0) {
    toast('error', 'Sin mesas disponibles', 'No hay mesas disponibles para pedidos.');
    return;
  }

  document.getElementById('selMesa').innerHTML = `
    <option value="">Seleccionar mesa</option>
    ${mesasDisponibles.map(m => `
      <option value="${m.id}">
        Mesa ${m.numero} - ${m.capacidad} personas - ${m.estado}
      </option>
    `).join('')}
  `;

  renderPlatosSeleccion();
  renderCart();
  openModal('pedidoModal');
}

function renderPlatosSeleccion() {
  const menu = DB.get(DB_KEYS.MENU) || [];
  const platosActivos = menu.filter(p => p.estado === 'Activo');

  const contenedor = document.getElementById('platosSel');

  if (platosActivos.length === 0) {
    contenedor.innerHTML = `
      <p style="text-align:center; padding:30px; color:var(--text-2);">
        No hay platos activos.
      </p>
    `;
    return;
  }

  contenedor.innerHTML = platosActivos.map(p => `
    <div class="cart-item" onclick="addToCart(${p.id})" style="cursor:pointer;">
      <div>
        <div class="nm">${p.icono || '🍽️'} ${p.nombre}</div>
        <div class="pr">${p.categoria || 'Sin categoría'}</div>
      </div>
      <strong>${fmt(p.precio)}</strong>
      <button class="btn btn-sm btn-primary" type="button">+</button>
    </div>
  `).join('');
}

function addToCart(platoId) {
  const menu = DB.get(DB_KEYS.MENU) || [];
  const plato = menu.find(p => p.id === platoId);

  if (!plato) return;

  const existe = cart.find(i => i.platoId === platoId);

  if (existe) {
    existe.cant++;
  } else {
    cart.push({
      platoId: plato.id,
      nombre: plato.nombre,
      precio: Number(plato.precio),
      cant: 1
    });
  }

  renderCart();
}

function changeQty(platoId, cantidad) {
  const item = cart.find(i => i.platoId === platoId);

  if (!item) return;

  item.cant += cantidad;

  if (item.cant <= 0) {
    cart = cart.filter(i => i.platoId !== platoId);
  }

  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cartList');
  const cartTotals = document.getElementById('cartTotals');

  if (!cart.length) {
    cartList.innerHTML = `
      <p style="text-align:center; color:var(--text-3); padding:30px;">
        Aún no hay platos seleccionados
      </p>
    `;
  } else {
    cartList.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div>
          <div class="nm">${i.nombre}</div>
          <div class="pr">${fmt(i.precio)} c/u</div>
        </div>

        <div class="qty">
          <button type="button" onclick="changeQty(${i.platoId}, -1)">−</button>
          <strong>${i.cant}</strong>
          <button type="button" onclick="changeQty(${i.platoId}, 1)">+</button>
        </div>

        <strong>${fmt(i.precio * i.cant)}</strong>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, i) => sum + i.precio * i.cant, 0);

  cartTotals.innerHTML = `
    <div class="row">
      <span>Subtotal</span>
      <span>${fmt(total)}</span>
    </div>
    <div class="row">
      <span>IGV incluido</span>
      <span>${fmt(total * 0.18)}</span>
    </div>
    <div class="row grand">
      <span>Total</span>
      <span>${fmt(total)}</span>
    </div>
  `;
}

function guardarPedido() {
  const mesaId = Number(document.getElementById('selMesa').value);

  if (!mesaId) {
    toast('error', 'Selecciona una mesa');
    return;
  }

  if (cart.length === 0) {
    toast('error', 'Agrega al menos un plato');
    return;
  }

  const pedidos = DB.get(DB_KEYS.PEDIDOS) || [];
  const mesas = DB.get(DB_KEYS.MESAS) || [];

  const total = cart.reduce((sum, i) => sum + i.precio * i.cant, 0);

  const nuevoPedido = {
    id: Date.now(),
    mesaId,
    mozo: 'Administrador',
    estado: 'Pendiente',
    items: [...cart],
    subtotal: total,
    total,
    fecha: new Date().toISOString()
  };

  pedidos.push(nuevoPedido);
  DB.set(DB_KEYS.PEDIDOS, pedidos);

  const mesaIndex = mesas.findIndex(m => m.id === mesaId);

  if (mesaIndex >= 0) {
    mesas[mesaIndex].estado = 'Ocupada';
    DB.set(DB_KEYS.MESAS, mesas);
  }

  closeModal('pedidoModal');
  toast('success', 'Pedido creado', 'El pedido fue registrado correctamente.');
  renderPedidos();
}

function verPedido(id) {
  const pedidos = DB.get(DB_KEYS.PEDIDOS) || [];
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) return;

  document.getElementById('detModalBody').innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:14px;">
      <div>
        <strong>Pedido #${pedido.id}</strong><br>
        <small>Mesa ${pedido.mesaId}</small>
      </div>
      <div>${estadoBadge(pedido.estado)}</div>
    </div>

    <table class="tbl">
      <thead>
        <tr>
          <th>Plato</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${pedido.items.map(i => `
          <tr>
            <td>${i.nombre}</td>
            <td>${i.cant}</td>
            <td>${fmt(i.precio)}</td>
            <td><strong>${fmt(i.precio * i.cant)}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="text-align:right; padding-top:14px; font-size:18px; font-weight:800;">
      Total: ${fmt(pedido.total)}
    </div>
  `;

  openModal('detPedidoModal');
}

function cambiarEstadoPedido(id) {
  const orden = ['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Pagado'];
  const pedidos = DB.get(DB_KEYS.PEDIDOS) || [];

  const index = pedidos.findIndex(p => p.id === id);

  if (index < 0) return;

  const estadoActual = pedidos[index].estado;
  const posicion = orden.indexOf(estadoActual);

  pedidos[index].estado = orden[(posicion + 1) % orden.length];

  DB.set(DB_KEYS.PEDIDOS, pedidos);
  toast('success', 'Estado actualizado', `Nuevo estado: ${pedidos[index].estado}`);
  renderPedidos();
}

function eliminarPedido(id) {
  if (!confirm('¿Eliminar este pedido?')) return;

  const pedidos = DB.get(DB_KEYS.PEDIDOS) || [];
  const nuevosPedidos = pedidos.filter(p => p.id !== id);

  DB.set(DB_KEYS.PEDIDOS, nuevosPedidos);
  toast('success', 'Pedido eliminado');
  renderPedidos();
}