/* pedidos.js - módulo de pedidos funcional independiente */

let pedidos = JSON.parse(localStorage.getItem('rp_pedidos')) || [];

function guardarPedidosStorage() {
  localStorage.setItem('rp_pedidos', JSON.stringify(pedidos));
}

function dinero(n) {
  return 'S/ ' + Number(n || 0).toFixed(2);
}

function obtenerFecha() {
  return new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function badgePedido(estado) {
  let clase = 'warning';

  if (estado === 'Pendiente') clase = 'warning';
  if (estado === 'En preparación') clase = 'info';
  if (estado === 'Listo') clase = 'success';
  if (estado === 'Entregado') clase = 'primary';
  if (estado === 'Pagado') clase = 'success';

  return `<span class="badge ${clase}">${estado}</span>`;
}

function renderPedidos() {
  const tabla = document.getElementById('pedidosTable');

  if (!tabla) return;

  if (pedidos.length === 0) {
    tabla.innerHTML = `
      <div style="text-align:center; padding:50px; color:var(--text-2);">
        <h3 style="font-size:20px; margin-bottom:8px;">No hay pedidos registrados</h3>
        <p>Presiona <strong>+ Nuevo pedido</strong> para registrar el primero.</p>
      </div>
    `;
    return;
  }

  tabla.innerHTML = `
    <table class="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Mesa</th>
          <th>Cliente</th>
          <th>Pedido</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        ${pedidos.map((p, index) => `
          <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>Mesa ${p.mesa}</td>
            <td>${p.cliente}</td>
            <td>${p.detalle}</td>
            <td><strong>${dinero(p.total)}</strong></td>
            <td>${badgePedido(p.estado)}</td>
            <td style="font-size:12px; color:var(--text-3);">${p.fecha}</td>
            <td>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn btn-sm btn-outline" onclick="verPedido(${index})">Ver</button>
                <button class="btn btn-sm btn-outline" onclick="cambiarEstadoPedido(${index})">Estado</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${index})">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function openNuevoPedido() {
  document.getElementById('mesaPedido').value = '';
  document.getElementById('clientePedido').value = '';
  document.getElementById('detallePedido').value = '';
  document.getElementById('totalPedido').value = '';
  document.getElementById('estadoPedido').value = 'Pendiente';
  document.getElementById('vistaTotalPedido').textContent = 'S/ 0.00';

  openModal('pedidoModal');
}

document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'totalPedido') {
    document.getElementById('vistaTotalPedido').textContent = dinero(e.target.value);
  }
});

function guardarPedido() {
  const mesa = document.getElementById('mesaPedido').value.trim();
  const cliente = document.getElementById('clientePedido').value.trim();
  const detalle = document.getElementById('detallePedido').value.trim();
  const total = document.getElementById('totalPedido').value;
  const estado = document.getElementById('estadoPedido').value;

  if (!mesa || !cliente || !detalle || !total) {
    alert('Completa todos los campos del pedido.');
    return;
  }

  const nuevoPedido = {
    id: Date.now(),
    mesa,
    cliente,
    detalle,
    total: Number(total),
    estado,
    fecha: obtenerFecha()
  };

  pedidos.push(nuevoPedido);
  guardarPedidosStorage();

  closeModal('pedidoModal');
  renderPedidos();

  alert('Pedido registrado correctamente.');
}

function verPedido(index) {
  const p = pedidos[index];

  if (!p) return;

  document.getElementById('detModalBody').innerHTML = `
    <div style="display:grid; gap:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="font-size:18px;">Pedido #${index + 1}</strong><br>
          <small style="color:var(--text-2);">Mesa ${p.mesa} · ${p.fecha}</small>
        </div>
        ${badgePedido(p.estado)}
      </div>

      <div class="card" style="background:var(--surface-2);">
        <p style="margin-bottom:8px;"><strong>Cliente:</strong></p>
        <p>${p.cliente}</p>
      </div>

      <div class="card" style="background:var(--surface-2);">
        <p style="margin-bottom:8px;"><strong>Detalle del pedido:</strong></p>
        <p>${p.detalle}</p>
      </div>

      <div style="text-align:right; font-size:22px; font-weight:800;">
        Total: ${dinero(p.total)}
      </div>
    </div>
  `;

  openModal('detPedidoModal');
}

function cambiarEstadoPedido(index) {
  const estados = ['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Pagado'];

  if (!pedidos[index]) return;

  const actual = pedidos[index].estado;
  const posicion = estados.indexOf(actual);

  pedidos[index].estado = estados[(posicion + 1) % estados.length];

  guardarPedidosStorage();
  renderPedidos();
}

function eliminarPedido(index) {
  if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;

  pedidos.splice(index, 1);
  guardarPedidosStorage();
  renderPedidos();
}