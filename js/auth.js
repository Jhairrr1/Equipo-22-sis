/* auth.js - Modo demo sin login */
function startDemoSession() {
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({
    id: 1,
    nombre: 'Administrador',
    email: 'admin@restaurante.com',
    rol: 'Administrador'
  }));
}
function doLogin(e) {
  if (e) e.preventDefault();
  startDemoSession();
  window.location.href = 'dashboard.html';
  return false;
}
function quickLogin() {
  startDemoSession();
  window.location.href = 'dashboard.html';
}
