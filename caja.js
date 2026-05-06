/* caja.js - Caja, pagos y comprobante */
let cobrandoId = null;

function renderCaja() {
  const pedidos = DB.get(DB_KEYS.PEDIDOS).filter(p=>['Listo','Entregado'].includes(p.estado));
  document.getElementById('cajaTable').innerHTML = pedidos.length ? `
    <table class="tbl">
      <thead><tr><th>#</th><th>Mesa</th><th>Items</th><th>Total</th><th>Estado</th><th>Hora</th><th>Acción</th></tr></thead>
      <tbody>${pedidos.map(p=>`
        <tr>
          <td><strong>#${p.id}</strong></td>
          <td>Mesa ${p.mesaId}</td>
          <td>${p.items.length} platos</td>
          <td><strong>${fmt(p.total)}</strong></td>
          <td>${estadoBadge(p.estado)}</td>
          <td style="font-size:12px; color:var(--text-3)">${shortDate(p.fecha)}</td>
          <td><button class="btn btn-sm btn-success" onclick="cobrar(${p.id})">💳 Cobrar</button></td>
        </tr>
      `).join('')}</tbody>
    </table>
  ` : '<p style="text-align:center; color:var(--text-2); padding:40px;">No hay pedidos pendientes de cobro</p>';

  const pagos = DB.get(DB_KEYS.PAGOS);
  document.getElementById('historialPagos').innerHTML = pagos.length ? `
    <table class="tbl">
      <thead><tr><th>#</th><th>Pedido</th><th>Monto</th><th>Método</th><th>Fecha</th></tr></thead>
      <tbody>${[...pagos].reverse().map(p=>`
        <tr>
          <td>${p.id}</td>
          <td>#${p.pedidoId}</td>
          <td><strong>${fmt(p.monto)}</strong></td>
          <td>${estadoBadge(p.metodo==='Efectivo'?'Activo':'Pendiente').replace('Activo',p.metodo).replace('Pendiente',p.metodo)}</td>
          <td style="font-size:12px; color:var(--text-3)">${shortDate(p.fecha)}</td>
        </tr>
      `).join('')}</tbody>
    </table>
  ` : '<p style="text-align:center; color:var(--text-2); padding:20px;">Sin pagos registrados</p>';
}
function cobrar(id) {
  cobrandoId = id;
  const p = DB.get(DB_KEYS.PEDIDOS).find(x=>x.id===id);
  document.getElementById('cobrarBody').innerHTML = `
    <div style="background:var(--surface-2); padding:14px; border-radius:8px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between;"><span>Pedido</span><strong>#${p.id}</strong></div>
      <div style="display:flex; justify-content:space-between;"><span>Mesa</span><strong>${p.mesaId}</strong></div>
      <div style="display:flex; justify-content:space-between; font-size:18px; padding-top:8px; border-top:1px solid var(--border); margin-top:8px;"><span>Total a cobrar</span><strong>${fmt(p.total)}</strong></div>
    </div>
    <label style="font-weight:600; margin-bottom:10px; display:block;">Método de pago</label>
    <div class="grid grid-2">
      ${['Efectivo','Tarjeta','Yape','Plin'].map(m=>`
        <label style="display:flex; align-items:center; gap:10px; padding:12px; border:2px solid var(--border); border-radius:8px; cursor:pointer;">
          <input type="radio" name="metodo" value="${m}" ${m==='Efectivo'?'checked':''}/>
          <span style="font-weight:600">${m==='Efectivo'?'💵':m==='Tarjeta'?'💳':m==='Yape'?'📱':'📲'} ${m}</span>
        </label>
      `).join('')}
    </div>
  `;
  openModal('cobrarModal');
}
function confirmarCobro() {
  const metodo = document.querySelector('input[name="metodo"]:checked').value;
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  const i = pedidos.findIndex(p=>p.id===cobrandoId);
  pedidos[i].estado = 'Pagado';
  DB.set(DB_KEYS.PEDIDOS, pedidos);
  const pagos = DB.get(DB_KEYS.PAGOS);
  pagos.push({ id: uid(), pedidoId: cobrandoId, monto: pedidos[i].total, metodo, fecha: new Date().toISOString() });
  DB.set(DB_KEYS.PAGOS, pagos);
  // Liberar mesa
  const mesas = DB.get(DB_KEYS.MESAS);
  const im = mesas.findIndex(m=>m.id===pedidos[i].mesaId);
  if (im >= 0) { mesas[im].estado = 'En limpieza'; DB.set(DB_KEYS.MESAS, mesas); }
  closeModal('cobrarModal');
  toast('success','Pago registrado',`${metodo}: ${fmt(pedidos[i].total)}`);
  mostrarComprobante(pedidos[i], metodo);
  renderCaja();
}
function mostrarComprobante(p, metodo) {
  document.getElementById('comprobanteBody').innerHTML = `
    <div class="receipt" id="receiptPrint">
      <h3>RestaurantePro</h3>
      <div class="ctr">RUC: 20100000001 • Av. Principal 123, Lima<br/>Comprobante de pago</div>
      <div class="row"><span>Pedido:</span><span>#${p.id}</span></div>
      <div class="row"><span>Mesa:</span><span>${p.mesaId}</span></div>
      <div class="row"><span>Fecha:</span><span>${shortDate(new Date().toISOString())}</span></div>
      <div class="row"><span>Método:</span><span>${metodo}</span></div>
      <div style="margin:10px 0; padding-top:8px; border-top:1px dashed var(--border);"></div>
      ${p.items.map(i=>`<div class="row"><span>${i.cant}× ${i.nombre}</span><span>${fmt(i.precio*i.cant)}</span></div>`).join('')}
      <div class="row total"><span>TOTAL</span><span>${fmt(p.total)}</span></div>
      <div class="thanks">¡Gracias por su preferencia! 🍽️</div>
    </div>
  `;
  openModal('comprobanteModal');
}
function imprimirComprobante() {
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Comprobante</title>
    <link rel="stylesheet" href="css/styles.css"/></head><body style="padding:20px;">${document.getElementById('receiptPrint').outerHTML}</body></html>`);
  w.document.close();
  setTimeout(()=>{ w.print(); w.close(); }, 250);
}
