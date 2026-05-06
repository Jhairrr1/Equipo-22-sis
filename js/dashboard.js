/* dashboard.js - KPIs, gráficos y resumen */
function renderDashboard() {
  const pedidos = DB.get(DB_KEYS.PEDIDOS);
  const mesas   = DB.get(DB_KEYS.MESAS);
  const pagos   = DB.get(DB_KEYS.PAGOS);
  const menu    = DB.get(DB_KEYS.MENU);

  const ventas = pedidos.filter(p=>p.estado==='Pagado').reduce((a,p)=>a+p.total,0);
  const activos = pedidos.filter(p=>['Pendiente','En preparación','Listo','Entregado'].includes(p.estado)).length;
  const ocupadas = mesas.filter(m=>m.estado==='Ocupada').length;
  const ticketProm = pagos.length ? ventas / pagos.length : 0;
  const ocupacion = mesas.length ? Math.round(ocupadas/mesas.length*100) : 0;

  document.getElementById('kpis').innerHTML = `
    <div class="kpi k1"><div class="icon-bg">💰</div><div class="label">Ventas del día</div><div class="value">${fmt(ventas)}</div><div class="delta">Registra pagos en Caja</div></div>
    <div class="kpi k2"><div class="icon-bg">📝</div><div class="label">Pedidos activos</div><div class="value">${activos}</div><div class="delta">${pedidos.length} pedidos registrados</div></div>
    <div class="kpi k3"><div class="icon-bg">🪑</div><div class="label">Mesas ocupadas</div><div class="value">${ocupadas}/${mesas.length}</div><div class="delta">${ocupacion}% ocupación</div></div>
    <div class="kpi k4"><div class="icon-bg">🎫</div><div class="label">Ticket promedio</div><div class="value">${fmt(ticketProm)}</div><div class="delta">Según pagos realizados</div></div>
  `;

  // Top platos
  const conteo = {};
  pedidos.forEach(p => p.items.forEach(it => { conteo[it.nombre] = (conteo[it.nombre]||0) + it.cant; }));
  const top = Object.entries(conteo).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const max = Math.max(...top.map(t=>t[1]), 1);
  document.getElementById('topPlatos').innerHTML = top.length ? `
    <div class="bars">
      ${top.map(([n,v])=>`
        <div class="bar-row">
          <div>${n}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${(v/max*100)}%"></div></div>
          <div class="v">${v} uds</div>
        </div>
      `).join('')}
    </div>` : '<p style="color:var(--text-2)">Sin datos aún</p>';

  // Por método de pago
  const metodos = {};
  pagos.forEach(p => { metodos[p.metodo] = (metodos[p.metodo]||0) + p.monto; });
  const colores = { Efectivo:'#10b981', Tarjeta:'#2563eb', Yape:'#8b5cf6', Plin:'#06b6d4' };
  document.getElementById('porMetodo').innerHTML = Object.keys(metodos).length ? `
    <div class="legend">
      ${Object.entries(metodos).map(([m,v])=>`
        <div class="legend-item">
          <div class="dot" style="background:${colores[m]||'#888'}"></div>
          <div style="flex:1">${m}</div>
          <div style="font-weight:700">${fmt(v)}</div>
        </div>
      `).join('')}
    </div>
  ` : '<p style="color:var(--text-2)">Sin pagos registrados</p>';

  // Últimos pedidos
  const ult = [...pedidos].reverse().slice(0,6);
  document.getElementById('ultPedidos').innerHTML = ult.length ? `
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>#</th><th>Mesa</th><th>Items</th><th>Total</th><th>Estado</th><th>Hora</th></tr></thead>
      <tbody>${ult.map(p=>`
        <tr>
          <td><strong>#${p.id}</strong></td>
          <td>Mesa ${p.mesaId}</td>
          <td>${p.items.length} platos</td>
          <td><strong>${fmt(p.total)}</strong></td>
          <td>${estadoBadge(p.estado)}</td>
          <td style="color:var(--text-3); font-size:12px">${timeAgo(p.fecha)}</td>
        </tr>
      `).join('')}</tbody>
    </table></div>
  ` : '<div class="empty-state"><div class="empty-icon">📝</div><h3>Aún no hay pedidos</h3><p>Cuando registres pedidos, aparecerán aquí.</p></div>';
}
