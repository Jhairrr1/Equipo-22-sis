/* reportes.js - Reportes y métricas */
function renderReportes() {
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  const pagos = DB.get(DB_KEYS.PAGOS);

  const totalRecaudado = pagos.reduce((a,p)=>a+p.monto,0);
  const ventasDia = pedidos.filter(p=>p.estado==='Pagado').reduce((a,p)=>a+p.total,0);
  const totalPedidos = pedidos.length;

  document.getElementById('repKpis').innerHTML = `
    <div class="kpi k1"><div class="icon-bg">💰</div><div class="label">Total recaudado</div><div class="value">${fmt(totalRecaudado)}</div></div>
    <div class="kpi k2"><div class="icon-bg">📊</div><div class="label">Ventas del día</div><div class="value">${fmt(ventasDia)}</div></div>
    <div class="kpi k3"><div class="icon-bg">📝</div><div class="label">Total pedidos</div><div class="value">${totalPedidos}</div></div>
    <div class="kpi k4"><div class="icon-bg">🎫</div><div class="label">Transacciones</div><div class="value">${pagos.length}</div></div>
  `;

  // Por método
  const metodos = {};
  pagos.forEach(p => { metodos[p.metodo] = (metodos[p.metodo]||0) + p.monto; });
  const max = Math.max(...Object.values(metodos), 1);
  document.getElementById('repMetodos').innerHTML = Object.keys(metodos).length ? `
    <div class="bars">
      ${Object.entries(metodos).map(([m,v])=>`
        <div class="bar-row">
          <div>${m}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${v/max*100}%"></div></div>
          <div class="v">${fmt(v)}</div>
        </div>
      `).join('')}
    </div>` : '<p style="color:var(--text-2)">Sin pagos registrados</p>';

  // Top platos
  const conteo = {};
  pedidos.forEach(p => p.items.forEach(it => { conteo[it.nombre] = (conteo[it.nombre]||0) + it.cant; }));
  const top = Object.entries(conteo).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxT = Math.max(...top.map(t=>t[1]), 1);
  document.getElementById('repTopPlatos').innerHTML = top.length ? `
    <div class="bars">
      ${top.map(([n,v])=>`
        <div class="bar-row">
          <div>${n}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${v/maxT*100}%; background:linear-gradient(90deg,var(--gold),var(--gold-2));"></div></div>
          <div class="v">${v} uds</div>
        </div>
      `).join('')}
    </div>` : '<p style="color:var(--text-2)">Sin datos</p>';

  // Pedidos por estado
  const estados = {};
  pedidos.forEach(p => { estados[p.estado] = (estados[p.estado]||0) + 1; });
  document.getElementById('repEstados').innerHTML = Object.keys(estados).length ? `
    <div class="legend">
      ${Object.entries(estados).map(([e,c])=>`
        <div class="legend-item">
          ${estadoBadge(e)}
          <div style="flex:1"></div>
          <strong>${c}</strong>
        </div>
      `).join('')}
    </div>
  ` : '<div class="empty-state"><div class="empty-icon">📊</div><h3>Sin pedidos</h3><p>Los estados aparecerán cuando registres pedidos.</p></div>';

  // Historial
  document.getElementById('repHistorial').innerHTML = pagos.length ? `
    <table class="tbl">
      <thead><tr><th>ID</th><th>Pedido</th><th>Monto</th><th>Método</th><th>Fecha</th></tr></thead>
      <tbody>${[...pagos].reverse().map(p=>`
        <tr>
          <td>${p.id}</td><td>#${p.pedidoId}</td>
          <td><strong>${fmt(p.monto)}</strong></td>
          <td><span class="badge primary">${p.metodo}</span></td>
          <td style="font-size:12px; color:var(--text-3)">${shortDate(p.fecha)}</td>
        </tr>
      `).join('')}</tbody>
    </table>
  ` : '<p style="text-align:center; color:var(--text-2); padding:20px;">Sin historial</p>';
}
