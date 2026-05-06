const NAV=[
{id:'dashboard',href:'dashboard.html',icon:'📊',label:'Dashboard'},
{id:'mesas',href:'mesas.html',icon:'🪑',label:'Mesas'},
{id:'menu',href:'menu.html',icon:'🍽️',label:'Menú'},
{id:'pedidos',href:'pedidos.html',icon:'📝',label:'Pedidos'},
{id:'cocina',href:'cocina.html',icon:'👨‍🍳',label:'Cocina'},
{id:'caja',href:'caja.html',icon:'💳',label:'Caja'},
{id:'reportes',href:'reportes.html',icon:'📈',label:'Reportes'}];
function getSession(){return JSON.parse(localStorage.getItem(DB_KEYS.SESSION)||'{"nombre":"Administrador","rol":"Administrador"}')}
function requireAuth(){return getSession()}
function renderShell(active,pageTitle,breadcrumb='Inicio'){
 const s=getSession();
 const side=document.getElementById('sidebar');
 if(side)side.innerHTML=`<div class="brand"><div class="brand-mark">🍽️</div><div><div class="brand-name">RestaurantePro</div><div class="brand-sub">Sistema de Gestión</div></div></div><div class="nav-title">Menú principal</div>${NAV.map(n=>`<a class="nav-link ${n.id===active?'active':''}" href="${n.href}"><span>${n.icon}</span>${n.label}</a>`).join('')}<div class="side-card"><b>${s.nombre}</b><small>${s.rol}</small><button class="btn btn-outline btn-sm" style="width:100%" onclick="limpiarDatos()">Limpiar datos</button></div>`;
 const h=document.getElementById('header');
 if(h)h.innerHTML=`<div><div class="crumb">${breadcrumb}</div><h1>${pageTitle}</h1></div><div class="header-right"><div class="pill">SIN LOGIN</div><div class="avatar">A</div><div class="user-meta"><b>Administrador</b><span>Administrador</span></div></div>`;
}
function limpiarDatos(){if(confirm('¿Borrar mesas, menú, pedidos y pagos?')){DB.clear();location.reload()}}
function uid(){return Date.now()+Math.floor(Math.random()*999)}
function fmt(n){return 'S/ '+Number(n||0).toFixed(2)}
function shortDate(iso){try{return new Date(iso).toLocaleString('es-PE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}catch(e){return '-'}}
function timeAgo(iso){const m=Math.max(0,Math.floor((Date.now()-new Date(iso))/60000));if(m<1)return'ahora';if(m<60)return`hace ${m} min`;return`hace ${Math.floor(m/60)} h`}
function openModal(id){const e=document.getElementById(id);if(e)e.classList.add('show')}
function closeModal(id){const e=document.getElementById(id);if(e)e.classList.remove('show')}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('show')});
function toast(type,title,body=''){let w=document.querySelector('.toast-wrap');if(!w){w=document.createElement('div');w.className='toast-wrap';document.body.appendChild(w)}const t=document.createElement('div');t.className='toast '+type;t.innerHTML=`<b>${title}</b>${body?`<div style="font-size:12px;color:#64748b;margin-top:3px">${body}</div>`:''}`;w.appendChild(t);setTimeout(()=>t.remove(),3000)}
function estadoBadge(e){const map={'Disponible':'success','Ocupada':'danger','Reservada':'warning','En limpieza':'info','Activo':'success','Inactivo':'muted','Pendiente':'warning','En preparación':'info','Listo':'success','Entregado':'primary','Pagado':'success','Efectivo':'success','Tarjeta':'primary','Yape':'purple','Plin':'info'};return `<span class="badge ${map[e]||'muted'}">${e}</span>`}
function confirmAction(msg,cb){if(confirm(msg))cb()}
