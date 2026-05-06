/* menu.js - CRUD del menú */
let editPlatoId = null;

function renderMenu() {
  const menu = DB.get(DB_KEYS.MENU);
  const q = (document.getElementById('buscarPlato')?.value || '').toLowerCase();
  const cat = document.getElementById('filtroCat')?.value || '';
  const list = menu.filter(p =>
    (!cat || p.categoria===cat) &&
    (!q || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q))
  );
  document.getElementById('menuGrid').innerHTML = list.length ? list.map(p=>`
    <div class="plato-card">
      <div class="img">${p.icono||'🍽️'}</div>
      <div class="body">
        <div class="row">
          <span class="badge primary">${p.categoria}</span>
          ${estadoBadge(p.estado)}
        </div>
        <div class="name" style="margin-top:8px">${p.nombre}</div>
        <div class="desc">${p.descripcion}</div>
        <div class="row">
          <div class="price">${fmt(p.precio)}</div>
          <div style="font-size:12px; color:var(--text-2)">Stock: <strong>${p.stock}</strong></div>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-outline" style="flex:1" onclick="openPlatoModal(${p.id})">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" onclick="delPlato(${p.id})">🗑️</button>
        </div>
      </div>
    </div>
  `).join('') : '<div class="empty-state wide"><div class="empty-icon">🍽️</div><h3>No hay platos registrados</h3><p>Presiona <strong>+ Nuevo plato</strong> para crear tu carta.</p></div>';
}
function openPlatoModal(id=null) {
  editPlatoId = id;
  document.getElementById('platoModalTitle').textContent = id ? 'Editar plato' : 'Nuevo plato';
  if (id) {
    const p = DB.get(DB_KEYS.MENU).find(x=>x.id===id);
    ['pNombre','pDesc','pCat','pPrecio','pStock','pEstado','pIcono'].forEach((f,i)=>{
      document.getElementById(f).value = [p.nombre,p.descripcion,p.categoria,p.precio,p.stock,p.estado,p.icono][i];
    });
  } else {
    ['pNombre','pDesc','pIcono'].forEach(f=>document.getElementById(f).value='');
    document.getElementById('pCat').value='Entradas';
    document.getElementById('pPrecio').value=0;
    document.getElementById('pStock').value=10;
    document.getElementById('pEstado').value='Activo';
    document.getElementById('pIcono').value='🍽️';
  }
  openModal('platoModal');
}
function savePlato(e) {
  e.preventDefault();
  const data = {
    nombre: document.getElementById('pNombre').value.trim(),
    descripcion: document.getElementById('pDesc').value.trim(),
    categoria: document.getElementById('pCat').value,
    precio: parseFloat(document.getElementById('pPrecio').value),
    stock: parseInt(document.getElementById('pStock').value),
    estado: document.getElementById('pEstado').value,
    icono: document.getElementById('pIcono').value || '🍽️'
  };
  if (!data.nombre || isNaN(data.precio)) { toast('error','Datos incompletos'); return false; }
  const menu = DB.get(DB_KEYS.MENU);
  if (editPlatoId) {
    const i = menu.findIndex(m=>m.id===editPlatoId);
    menu[i] = { ...menu[i], ...data };
    toast('success','Plato actualizado');
  } else {
    menu.push({ id: uid(), ...data });
    toast('success','Plato registrado');
  }
  DB.set(DB_KEYS.MENU, menu);
  closeModal('platoModal');
  renderMenu();
  return false;
}
function delPlato(id) {
  confirmAction('¿Eliminar este plato?', () => {
    DB.set(DB_KEYS.MENU, DB.get(DB_KEYS.MENU).filter(m=>m.id!==id));
    toast('success','Plato eliminado');
    renderMenu();
  });
}
