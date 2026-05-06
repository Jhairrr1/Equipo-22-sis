const DB_KEYS={MESAS:'rp_mesas',MENU:'rp_menu',PEDIDOS:'rp_pedidos',PAGOS:'rp_pagos'};
const DB={init(){Object.values(DB_KEYS).forEach(k=>{if(!localStorage.getItem(k))localStorage.setItem(k,'[]')})},get(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},clear(){Object.values(DB_KEYS).forEach(k=>localStorage.setItem(k,'[]'))}};
DB.init();
