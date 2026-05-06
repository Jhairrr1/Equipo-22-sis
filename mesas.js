/* mesas.js - CRUD de mesas */
let editMesaId = null;

function renderMesas() {
  const mesas = DB.get(DB_KEYS.MESAS);
  const filtro = document.getElementById('filtroEstado')?.value || '';
  const list = filtro ? mesas.filter(m=>m.estado===filtro) : mesas;
  const grid = document.getElementById('mesasGrid');
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state wide"><div class="empty-icon">🪑</div><h3>No hay mesas registradas</h3><p>Presiona <strong>+ Nueva mesa</strong> para agregar tus mesas.</p></div>';
    return;
  }
  grid.innerHTML = list.map(m => {
    const cls = m.estado.toLowerCase().replace('en limpieza','limpieza').replace('í','i');
    return `
    <div class="mesa-card ${cls}">
      <div style="font-size:11px; color:var(--text-3); text-transform:uppercase; letter-spacing:1px;">Mesa</div>
      <div class="num">${m.numero}</div>
      <div class="cap">👥 ${m.capacidad} personas</div>
      <div class="estado">${estadoBadge(m.estado)}</div>
      <div style="display:flex; gap:6px; margin-top:14px; justify-content:center;">
        <button class="btn btn-sm btn-outline" onclick="cambiarEstado(${m.id})">Estado</button>
        <button class="btn btn-sm btn-outline" onclick="editMesa(${m.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="delMesa(${m.id})">🗑️</button>
      </div>
    </div>`;
  }).join('');
}
function openMesaModal(id=null) {
  editMesaId = id;
  document.getElementById('mesaModalTitle').textContent = id ? 'Editar mesa' : 'Nueva mesa';
  if (id) {
    const m = DB.get(DB_KEYS.MESAS).find(x=>x.id===id);
    document.getElementById('mNumero').value = m.numero;
    document.getElementById('mCapacidad').value = m.capacidad;
    document.getElementById('mEstado').value = m.estado;
  } else {
    document.getElementById('mNumero').value = '';
    document.getElementById('mCapacidad').value = 4;
    document.getElementById('mEstado').value = 'Disponible';
  }
  openModal('mesaModal');
}
function editMesa(id) { openMesaModal(id); }
function saveMesa(e) {
  e.preventDefault();
  const numero = parseInt(document.getElementById('mNumero').value);
  const capacidad = parseInt(document.getElementById('mCapacidad').value);
  const estado = document.getElementById('mEstado').value;
  if (!numero || !capacidad) { toast('error','Datos incompletos'); return false; }
  const mesas = DB.get(DB_KEYS.MESAS);
  if (editMesaId) {
    const i = mesas.findIndex(m=>m.id===editMesaId);
    mesas[i] = { ...mesas[i], numero, capacidad, estado };
    toast('success','Mesa actualizada');
  } else {
    mesas.push({ id: uid(), numero, capacidad, estado });
    toast('success','Mesa registrada');
  }
  DB.set(DB_KEYS.MESAS, mesas);
  closeModal('mesaModal');
  renderMesas();
  return false;
}
function delMesa(id) {
  confirmAction('¿Eliminar esta mesa?', () => {
    DB.set(DB_KEYS.MESAS, DB.get(DB_KEYS.MESAS).filter(m=>m.id!==id));
    toast('success','Mesa eliminada');
    renderMesas();
  });
}
function cambiarEstado(id) {
  const orden = ['Disponible','Ocupada','Reservada','En limpieza'];
  const mesas = DB.get(DB_KEYS.MESAS);
  const i = mesas.findIndex(m=>m.id===id);
  const cur = orden.indexOf(mesas[i].estado);
  mesas[i].estado = orden[(cur+1) % orden.length];
  DB.set(DB_KEYS.MESAS, mesas);
  toast('success','Estado actualizado', `Mesa ${mesas[i].numero}: ${mesas[i].estado}`);
  renderMesas();
}
