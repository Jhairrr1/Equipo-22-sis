const platosActivos = [
  let mozo=document.getElementById("mozo").value;
  let mesa=parseInt(document.getElementById("mesa").value);
  let prioridad=document.getElementById("prioridad").value;
  let just=document.getElementById("justificacion").value;

  if(mozo.length<3) return alert("Mozo inválido");
  if(isNaN(mesa)||mesa<=0||mesa>50) return alert("Mesa inválida");
  if(carrito.length==0) return alert("Sin platos");
  if(prioridad=="Urgente" && just.length<10) return alert("Justificación requerida");

  let pedido={
    codigo:document.getElementById("codigo").value,
    mozo,
    mesa,
    fecha:new Date().toLocaleString(),
    platos:carrito,
    total:carrito.reduce((a,b)=>a+b.subtotal,0),
    prioridad,
    estado:"Registrado"
  };

  let lista=JSON.parse(localStorage.getItem("pedidos"))||[];
  lista.push(pedido);
  localStorage.setItem("pedidos",JSON.stringify(lista));

  carrito=[];
  contador++;
  init();
}

function mostrarPedidos(){
  let lista=JSON.parse(localStorage.getItem("pedidos"))||[];
  let html="";

  lista.forEach((p,i)=>{
    html+=`
      <div class='pedido'>
        <b>${p.codigo}</b><br>
        Mozo: ${p.mozo}<br>
        Mesa: ${p.mesa}<br>
        Estado: ${p.estado}<br>
        Total: S/ ${p.total}<br>
        <button onclick='cambiarEstado(${i})'>Enviar a cocina</button>
        <button onclick='cancelar(${i})'>Cancelar</button>
      </div>
    `;
  });

  document.getElementById("lista").innerHTML=html;
}

function cambiarEstado(i){
  let lista=JSON.parse(localStorage.getItem("pedidos"));
  lista[i].estado="Enviado a cocina";
  localStorage.setItem("pedidos",JSON.stringify(lista));
  mostrarPedidos();
}

function cancelar(i){
  let lista=JSON.parse(localStorage.getItem("pedidos"));
  lista[i].estado="Cancelado";
  localStorage.setItem("pedidos",JSON.stringify(lista));
  mostrarPedidos();
}

init();