/* =============================================================
   app.js - Layout (sidebar + header), helpers globales, toasts, modal
   ============================================================= */

const ROLE_PERMS = {
  Administrador: ['dashboard','mesas','menu','pedidos','cocina','caja','reportes'],
  Mozo:         ['dashboard','mesas','pedidos'],
  Cocinero:     ['dashboard','cocina'],
  Cajero:       ['dashboard','caja','reportes']
};

const NAV = [
  { id:'dashboard', href:'dashboard.html', icon:'📊', label:'Dashboard' },
  { id:'mesas',     href:'mesas.html',     icon:'🪑', label:'Mesas' },
  { id:'menu',      href:'menu.html',      icon:'🍽️', label:'Menú' },
  { id:'pedidos',   href:'pedidos.html',   icon:'📝', label:'Pedidos' },
  { id:'cocina',    href:'cocina.html',    icon:'👨‍🍳', label:'Cocina' },
  { id:'caja',      href:'caja.html',      icon:'💳', label:'Caja' },
  { id:'reportes',  href:'reportes.html',  icon:'📈', label:'Reportes' }
];

const AUTO_LOGIN = true;
const DEFAULT_SESSION = {
  id: 1,
  nombre: 'Administrador',
  email: 'admin@restaurante.com',
  rol: 'Administrador'
};

function autoStartSession() {
  let s = JSON.parse(localStorage.getItem(DB_KEYS.SESSION) || 'null');
  if (!s && AUTO_LOGIN) {
    s = DEFAULT_SESSION;
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(s));
  }
  return s;
}
function getSession() {
  return autoStartSession();
}
function requireAuth(allowedRoles) {
  const s = autoStartSession();
  if (!s) return null;
  // En modo demo sin login, el usuario entra como Administrador y tiene acceso total.
  if (allowedRoles && !allowedRoles.includes(s.rol) && s.rol !== 'Administrador') {
    toast('error', 'Acceso denegado', 'No tienes permisos para esta sección.');
    setTimeout(()=> window.location.href = 'dashboard.html', 800);
    return null;
  }
  return s;
}
function logout() {
  localStorage.removeItem(DB_KEYS.SESSION);
  autoStartSession();
  toast('success', 'Modo demo activo', 'El sistema seguirá entrando sin pedir login.');
  setTimeout(()=> window.location.href = 'dashboard.html', 500);
}

function initials(name) {
  return name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
}
function fmt(n) { return 'S/ ' + Number(n).toFixed(2); }
function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es-PE', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short' });
}
function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso))/60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  return `hace ${Math.floor(m/60)} h`;
}
function uid() { return Date.now() + Math.floor(Math.random()*1000); }

/* ---------- Sidebar + Header render ---------- */
function renderShell(activeId, pageTitle, breadcrumb='Inicio') {
  const s = getSession();
  if (!s) return;
  const allowed = ROLE_PERMS[s.rol] || [];
  const navItems = NAV.filter(n => allowed.includes(n.id));

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">🍽️</div>
        <div>
          <div class="brand-name">RestaurantePro</div>
          <div class="brand-sub">Sistema de Gestión</div>
        </div>
      </div>
      <div class="nav-section">Menú principal</div>
      ${navItems.map(n => `
        <a class="nav-link ${n.id===activeId?'active':''}" href="${n.href}">
          <span class="icon">${n.icon}</span> ${n.label}
        </a>
      `).join('')}
      <div class="user-card">
        <div class="name">${s.nombre}</div>
        <div class="role">${s.rol}</div>
        <button class="btn btn-outline btn-sm" style="width:100%; margin-top:10px;" onclick="if(confirm('¿Seguro que deseas borrar todos los datos registrados?')){ DB.reset(); autoStartSession(); location.reload(); }">Limpiar datos</button>
      </div>
    `;
  }
  const header = document.getElementById('header');
  if (header) {
    header.innerHTML = `
      <div style="display:flex; align-items:center; gap:14px;">
        <button class="mobile-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
        <div>
          <div class="crumb">${breadcrumb}</div>
          <h1>${pageTitle}</h1>
        </div>
      </div>
      <div class="header-right">
        <div class="demo-pill">Sin login</div>
        <div class="user-chip">
          <div class="avatar">${initials(s.nombre)}</div>
          <div class="meta">
            <div class="name">${s.nombre}</div>
            <div class="role">${s.rol}</div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ---------- TOASTS ---------- */
function toast(type, title, body='') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="t-title">${title}</div>${body?`<div class="t-body">${body}</div>`:''}`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 3000);
}

/* ---------- MODAL ---------- */
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

/* Click outside */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});

function confirmAction(msg, cb) {
  if (window.confirm(msg)) cb();
}

function estadoBadge(estado) {
  const map = {
    'Disponible':'success', 'Ocupada':'danger', 'Reservada':'warning', 'En limpieza':'info',
    'Activo':'success', 'Inactivo':'muted',
    'Pendiente':'warning', 'En preparación':'info', 'Listo':'primary', 'Entregado':'purple', 'Pagado':'success'
  };
  return `<span class="badge ${map[estado]||'muted'}">${estado}</span>`;
}
