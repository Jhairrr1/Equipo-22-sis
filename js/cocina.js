/* cocina.js - Tablero Kanban */
function renderCocina() {
  const pedidos = DB.get(DB_KEYS.PEDIDOS).filter(p=>['Pendiente','En preparación','Listo'].includes(p.estado));
  const cols = { 'Pendiente': [], 'En preparación': [], 'Listo': [] };
  pedidos.forEach(p => cols[p.estado].push(p));

  const cardHTML = (p, btnLabel, nextEstado) => `
    <div class="k-card">
      <div class="head">
        <div class="mesa">Mesa ${p.mesaId}</div>
        <div class="time">${timeAgo(p.fecha)}</div>
      </div>
      <div style="font-size:11px; color:var(--text-3); margin-bottom:6px">Pedido #${p.id} • ${p.mozo}</div>
      <ul>${p.items.map(i=>`<li><span>${i.nombre}</span><strong>×${i.cant}</strong></li>`).join('')}</ul>
      ${btnLabel ? `<div class="btns"><button class="btn btn-sm btn-primary" style="flex:1" onclick="moverCocina(${p.id},'${nextEstado}')">${btnLabel}</button></div>` : ''}
    </div>
  `;

  document.getElementById('colPendiente').innerHTML = cols['Pendiente'].map(p=>cardHTML(p,'▶ Iniciar preparación','En preparación')).join('') || '<p style="color:var(--text-3); text-align:center; padding:20px;">Sin pendientes</p>';
  document.getElementById('colPrep').innerHTML = cols['En preparación'].map(p=>cardHTML(p,'✓ Marcar como listo','Listo')).join('') || '<p style="color:var(--text-3); text-align:center; padding:20px;">Nada en preparación</p>';
  document.getElementById('colListo').innerHTML = cols['Listo'].map(p=>cardHTML(p,'📦 Entregar','Entregado')).join('') || '<p style="color:var(--text-3); text-align:center; padding:20px;">Nada listo</p>';

  document.getElementById('cntPend').textContent = cols['Pendiente'].length;
  document.getElementById('cntPrep').textContent = cols['En preparación'].length;
  document.getElementById('cntListo').textContent = cols['Listo'].length;
}
function moverCocina(id, nuevoEstado) {
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  const i = pedidos.findIndex(p=>p.id===id);
  pedidos[i].estado = nuevoEstado;
  DB.set(DB_KEYS.PEDIDOS, pedidos);
  toast('success','Estado actualizado',`Pedido #${id}: ${nuevoEstado}`);
  renderCocina();
}
