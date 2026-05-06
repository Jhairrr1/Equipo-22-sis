/* =============================================================
   data.js - Base de datos local vacía para que llenes tu información
   ============================================================= */

const DB_KEYS = {
  USERS: 'rp_users_blank_v1',
  MESAS: 'rp_mesas_blank_v1',
  MENU:  'rp_menu_blank_v1',
  PEDIDOS: 'rp_pedidos_blank_v1',
  PAGOS: 'rp_pagos_blank_v1',
  SESSION: 'rp_session_blank_v1',
  VERSION: 'rp_schema_blank_v1'
};

const DEFAULT_USERS = [
  { id: 1, nombre: 'Administrador', email: 'admin@restaurante.com', password: '123456', rol: 'Administrador' }
];

const EMPTY_MESAS = [];
const EMPTY_MENU = [];
const EMPTY_PEDIDOS = [];
const EMPTY_PAGOS = [];

/* ---------- DB helpers ---------- */
const DB = {
  init() {
    // Primera carga de esta versión: empieza totalmente vacío.
    if (localStorage.getItem(DB_KEYS.VERSION) !== 'ok') {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      localStorage.setItem(DB_KEYS.MESAS, JSON.stringify(EMPTY_MESAS));
      localStorage.setItem(DB_KEYS.MENU, JSON.stringify(EMPTY_MENU));
      localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify(EMPTY_PEDIDOS));
      localStorage.setItem(DB_KEYS.PAGOS, JSON.stringify(EMPTY_PAGOS));
      localStorage.setItem(DB_KEYS.VERSION, 'ok');
    }

    if (!localStorage.getItem(DB_KEYS.USERS))   localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    if (!localStorage.getItem(DB_KEYS.MESAS))   localStorage.setItem(DB_KEYS.MESAS, JSON.stringify(EMPTY_MESAS));
    if (!localStorage.getItem(DB_KEYS.MENU))    localStorage.setItem(DB_KEYS.MENU, JSON.stringify(EMPTY_MENU));
    if (!localStorage.getItem(DB_KEYS.PEDIDOS)) localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify(EMPTY_PEDIDOS));
    if (!localStorage.getItem(DB_KEYS.PAGOS))   localStorage.setItem(DB_KEYS.PAGOS, JSON.stringify(EMPTY_PAGOS));
  },
  get(k)   { return JSON.parse(localStorage.getItem(k) || '[]'); },
  set(k,v) { localStorage.setItem(k, JSON.stringify(v)); },
  reset()  {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(DB_KEYS.MESAS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.MENU, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.PAGOS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.VERSION, 'ok');
  }
};

DB.init();
