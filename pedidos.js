/* pedidos.js - Gestión de pedidos */
let cart = [];
let currentMesa = '';

function renderPedidos() {
  const pedidos = [...DB.get(DB_KEYS.PEDIDOS)].reverse();
  document.getElementById('pedidosTable').innerHTML = pedidos.length ? `
    <table class="tbl">
      <thead><tr><th>#</th><th>Mesa</th><th>Mozo</th><th>Items</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
      <tbody>${pedidos.map(p=>`
        <tr>
          <td><strong>#${p.id}</strong></td>
          <td>Mesa ${p.mesaId}</td>
          <td>${p.mozo}</td>
          <td>${p.items.length}</td>
          <td><strong>${fmt(p.total)}</strong></td>
          <td>${estadoBadge(p.estado)}</td>
          <td style="font-size:12px; color:var(--text-3)">${shortDate(p.fecha)}</td>
          <td class="actions">
            <button class="btn btn-sm btn-outline" onclick="verPedido(${p.id})">👁️</button>
            <button class="btn btn-sm btn-outline" onclick="cambiarEstadoPedido(${p.id})">🔄</button>
          </td>
        </tr>
      `).join('')}</tbody>
    </table>
  ` : '<div class="empty-state"><div class="empty-icon">📝</div><h3>Aún no hay pedidos</h3><p>Primero registra mesas y platos, luego crea tu primer pedido.</p></div>';
}
function openNuevoPedido() {
  cart = [];
  currentMesa = '';
  const mesas = DB.get(DB_KEYS.MESAS).filter(m=>m.estado==='Disponible' || m.estado==='Ocupada');
  document.getElementById('selMesa').innerHTML = '<option value="">— Seleccionar mesa —</option>' +
    (mesas.length ? mesas.map(m=>`<option value="${m.id}">Mesa ${m.numero} (${m.capacidad}p) - ${m.estado}</option>`).join('') : '<option value="" disabled>No hay mesas disponibles</option>');
  renderPlatosSeleccion();
  renderCart();
  openModal('pedidoModal');
}
function renderPlatosSeleccion() {
  const menu = DB.get(DB_KEYS.MENU).filter(p=>p.estado==='Activo');
  document.getElementById('platosSel').innerHTML = menu.length ? menu.map(p=>`
    <div class="cart-item" style="cursor:pointer" onclick="addToCart(${p.id})">
      <div><div class="nm">${p.icono} ${p.nombre}</div><div class="pr">${p.categoria}</div></div>
      <div style="font-weight:700; color:var(--gold-2)">${fmt(p.precio)}</div>
      <div><button class="btn btn-sm btn-primary">+</button></div>
    </div>
  `).join('') : '<div class="empty-state"><div class="empty-icon">🍽️</div><h3>Sin platos</h3><p>Agrega platos en el módulo Menú.</p></div>';
}
function addToCart(platoId) {
  const p = DB.get(DB_KEYS.MENU).find(x=>x.id===platoId);
  const ex = cart.find(c=>c.platoId===platoId);
  if (ex) ex.cant++;
  else cart.push({ platoId: p.id, nombre: p.nombre, precio: p.precio, cant: 1 });
  renderCart();
}
function changeQty(platoId, delta) {
  const it = cart.find(c=>c.platoId===platoId);
  it.cant += delta;
  if (it.cant <= 0) cart = cart.filter(c=>c.platoId!==platoId);
  renderCart();
}
function renderCart() {
  const list = document.getElementById('cartList');
  if (!cart.length) {
    list.innerHTML = '<p style="text-align:center; color:var(--text-3); padding:30px;">Aún no hay platos seleccionados</p>';
  } else {
    list.innerHTML = cart.map(c=>`
      <div class="cart-item">
        <div><div class="nm">${c.nombre}</div><div class="pr">${fmt(c.precio)} c/u</div></div>
        <div class="qty">
          <button onclick="changeQty(${c.platoId},-1)">−</button>
          <strong>${c.cant}</strong>
          <button onclick="changeQty(${c.platoId},1)">+</button>
        </div>
        <div style="font-weight:700">${fmt(c.precio*c.cant)}</div>
      </div>
    `).join('');
  }
  const subtotal = cart.reduce((a,c)=>a+c.precio*c.cant, 0);
  document.getElementById('cartTotals').innerHTML = `
    <div class="row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
    <div class="row"><span>IGV (incl.)</span><span>${fmt(subtotal*0.18)}</span></div>
    <div class="row grand"><span>TOTAL</span><span>${fmt(subtotal)}</span></div>
  `;
}
function guardarPedido() {
  const mesaId = parseInt(document.getElementById('selMesa').value);
  if (!mesaId) { toast('error','Selecciona una mesa'); return; }
  if (!cart.length) { toast('error','Agrega al menos un plato'); return; }
  const subtotal = cart.reduce((a,c)=>a+c.precio*c.cant, 0);
  const s = getSession();
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  pedidos.push({
    id: uid(), mesaId, mozo: s.nombre, estado: 'Pendiente',
    items: [...cart], subtotal, total: subtotal, fecha: new Date().toISOString()
  });
  DB.set(DB_KEYS.PEDIDOS, pedidos);
  // Marcar mesa como ocupada
  const mesas = DB.get(DB_KEYS.MESAS);
  const im = mesas.findIndex(m=>m.id===mesaId);
  if (im >= 0) { mesas[im].estado = 'Ocupada'; DB.set(DB_KEYS.MESAS, mesas); }
  toast('success','Pedido creado','Enviado a cocina');
  closeModal('pedidoModal');
  renderPedidos();
}
function verPedido(id) {
  const p = DB.get(DB_KEYS.PEDIDOS).find(x=>x.id===id);
  document.getElementById('detModalBody').innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:14px;">
      <div><strong>Pedido #${p.id}</strong><br><small>Mesa ${p.mesaId} • ${p.mozo}</small></div>
      <div>${estadoBadge(p.estado)}</div>
    </div>
    <table class="tbl">
      <thead><tr><th>Plato</th><th>Cant</th><th>P. Unit</th><th>Subtotal</th></tr></thead>
      <tbody>${p.items.map(i=>`
        <tr><td>${i.nombre}</td><td>${i.cant}</td><td>${fmt(i.precio)}</td><td><strong>${fmt(i.precio*i.cant)}</strong></td></tr>
      `).join('')}</tbody>
    </table>
    <div style="text-align:right; padding-top:14px; font-size:18px; font-weight:800;">TOTAL: ${fmt(p.total)}</div>
  `;
  openModal('detPedidoModal');
}
function cambiarEstadoPedido(id) {
  const orden = ['Pendiente','En preparación','Listo','Entregado','Pagado'];
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  const i = pedidos.findIndex(p=>p.id===id);
  const cur = orden.indexOf(pedidos[i].estado);
  if (cur === orden.length-1) { toast('warning','Pedido ya pagado'); return; }
  pedidos[i].estado = orden[cur+1];
  DB.set(DB_KEYS.PEDIDOS, pedidos);
  toast('success','Estado actualizado', `Pedido #${id}: ${pedidos[i].estado}`);
  renderPedidos();
}
