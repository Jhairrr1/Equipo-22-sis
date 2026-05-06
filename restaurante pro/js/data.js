const DB_KEYS={MESAS:'rp_mesas',MENU:'rp_menu',PEDIDOS:'rp_pedidos',PAGOS:'rp_pagos',SESSION:'rp_session'};
const DB={
  init(){
    if(localStorage.getItem(DB_KEYS.MESAS)===null)localStorage.setItem(DB_KEYS.MESAS,'[]');
    if(localStorage.getItem(DB_KEYS.MENU)===null)localStorage.setItem(DB_KEYS.MENU,'[]');
    if(localStorage.getItem(DB_KEYS.PEDIDOS)===null)localStorage.setItem(DB_KEYS.PEDIDOS,'[]');
    if(localStorage.getItem(DB_KEYS.PAGOS)===null)localStorage.setItem(DB_KEYS.PAGOS,'[]');
    if(localStorage.getItem(DB_KEYS.SESSION)===null)localStorage.setItem(DB_KEYS.SESSION,JSON.stringify({id:1,nombre:'Administrador',rol:'Administrador'}));
  },
  get(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return []}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))},
  clear(){[DB_KEYS.MESAS,DB_KEYS.MENU,DB_KEYS.PEDIDOS,DB_KEYS.PAGOS].forEach(k=>localStorage.setItem(k,'[]'))}
};
DB.init();
