/* ====================================
   MÓDULO 3 - LÓGICA DE FACTURACIÓN
   ==================================== */

// VARIABLES GLOBALES
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let itemsActuales = [];
let numeroFacturaActual = parseInt(localStorage.getItem('numeroFactura')) || 1;
let facturaActual = null;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
  inicializarDatos();
  cargarFacturas();
  actualizarEstadisticas();
  
  // Event listeners para preview
  document.getElementById('itemCantidad').addEventListener('input', actualizarPreview);
  document.getElementById('itemPrecio').addEventListener('input', actualizarPreview);
  document.getElementById('itemDescuento').addEventListener('input', actualizarPreview);
});

// INICIALIZAR DATOS
function inicializarDatos() {
  // Establecer fecha actual
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fechaEmision').value = hoy;
  
  // Calcular vencimiento (30 días después)
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30);
  document.getElementById('fechaVencimiento').value = fecha.toISOString().split('T')[0];
  
  // Establecer número de factura
  document.getElementById('numeroFact').value = 'F001-' + String(numeroFacturaActual).padStart(6, '0');
}

// CAMBIAR TAB
function cambiarTab(tab) {
  // Ocultar todos los tabs
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  // Mostrar tab seleccionado
  document.getElementById('tab-' + tab).classList.add('active');
  event.target.classList.add('active');
  
  // Cargar datos si es necesario
  if (tab === 'historial') {
    cargarFacturas();
  } else if (tab === 'reportes') {
    cargarReportes();
  }
}

// ===================== NUEVA FACTURA =====================

// ACTUALIZAR PREVIEW DEL ITEM
function actualizarPreview() {
  const cantidad = parseFloat(document.getElementById('itemCantidad').value) || 0;
  const precio = parseFloat(document.getElementById('itemPrecio').value) || 0;
  const descuento = parseFloat(document.getElementById('itemDescuento').value) || 0;
  
  const subtotal = cantidad * precio;
  const descuentoMonto = (subtotal * descuento) / 100;
  const total = subtotal - descuentoMonto;
  
  document.getElementById('previewSubtotal').textContent = 'S/ ' + total.toFixed(2);
}

// AGREGAR ITEM
function agregarItem() {
  const descripcion = document.getElementById('itemDescripcion').value.trim();
  const cantidad = parseFloat(document.getElementById('itemCantidad').value);
  const precio = parseFloat(document.getElementById('itemPrecio').value);
  const descuento = parseFloat(document.getElementById('itemDescuento').value) || 0;
  
  // Validaciones
  if (!descripcion) {
    alert('❌ Ingrese la descripción del item');
    return;
  }
  if (cantidad <= 0 || !cantidad) {
    alert('❌ Ingrese una cantidad válida');
    return;
  }
  if (precio < 0 || !precio) {
    alert('❌ Ingrese un precio válido');
    return;
  }
  
  // Crear objeto del item
  const item = {
    id: Date.now(),
    descripcion: descripcion,
    cantidad: cantidad,
    precio: precio,
    descuento: descuento,
    subtotal: (cantidad * precio * (1 - descuento / 100))
  };
  
  itemsActuales.push(item);
  
  // Limpiar inputs
  document.getElementById('itemDescripcion').value = '';
  document.getElementById('itemCantidad').value = '1';
  document.getElementById('itemPrecio').value = '0';
  document.getElementById('itemDescuento').value = '0';
  
  // Actualizar visualización
  actualizarListaItems();
  actualizarResumen();
}

// ACTUALIZAR LISTA DE ITEMS
function actualizarListaItems() {
  const lista = document.getElementById('itemsList');
  
  if (itemsActuales.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📦</span>
        <p>No hay items agregados</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  itemsActuales.forEach(item => {
    const totalItem = item.cantidad * item.precio;
    const descuentoMonto = (totalItem * item.descuento) / 100;
    const neto = totalItem - descuentoMonto;
    
    html += `
      <div class="item-card">
        <div class="item-info">
          <div class="item-desc">${item.descripcion}</div>
          <div class="item-det">
            ${item.cantidad} x S/ ${item.precio.toFixed(2)} 
            ${item.descuento > 0 ? `(${item.descuento}% desc)` : ''}
          </div>
        </div>
        <div class="item-total">S/ ${neto.toFixed(2)}</div>
        <button class="btn-remove" onclick="eliminarItem(${item.id})">✕</button>
      </div>
    `;
  });
  
  lista.innerHTML = html;
}

// ELIMINAR ITEM
function eliminarItem(id) {
  itemsActuales = itemsActuales.filter(item => item.id !== id);
  actualizarListaItems();
  actualizarResumen();
}

// ACTUALIZAR RESUMEN
function actualizarResumen() {
  let subtotal = 0;
  let descuentoTotal = 0;
  
  itemsActuales.forEach(item => {
    const totalItem = item.cantidad * item.precio;
    subtotal += totalItem;
    descuentoTotal += (totalItem * item.descuento) / 100;
  });
  
  const base = subtotal - descuentoTotal;
  const igv = base * 0.18;
  const total = base + igv;
  
  document.getElementById('resumenSubtotal').textContent = 'S/ ' + subtotal.toFixed(2);
  document.getElementById('resumenDescuento').textContent = 'S/ ' + descuentoTotal.toFixed(2);
  document.getElementById('resumenBase').textContent = 'S/ ' + base.toFixed(2);
  document.getElementById('resumenIGV').textContent = 'S/ ' + igv.toFixed(2);
  document.getElementById('resumenTotal').textContent = 'S/ ' + total.toFixed(2);
}

// SELECCIONAR MÉTODO DE PAGO
function seleccionarPago(btn, metodo) {
  document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('metodoPago').value = metodo;
  
  // Mostrar/ocultar días de crédito
  document.getElementById('diasCreditoDiv').style.display = metodo === 'credito' ? 'block' : 'none';
}

// BUSCAR CLIENTE
function buscarCliente() {
  const ruc = document.getElementById('clienteRuc').value.trim();
  
  if (!ruc) {
    alert('❌ Ingrese RUC/DNI para buscar');
    return;
  }
  
  const cliente = clientes.find(c => c.ruc === ruc);
  
  if (cliente) {
    document.getElementById('clienteNombre').value = cliente.nombre;
    document.getElementById('clienteEmail').value = cliente.email || '';
    document.getElementById('clienteTelefono').value = cliente.telefono || '';
    document.getElementById('clienteDireccion').value = cliente.direccion || '';
    alert('✅ Cliente encontrado');
  } else {
    alert('ℹ️ Cliente no registrado. Complete los datos para guardarlo');
  }
}

// GUARDAR CLIENTE
function guardarCliente() {
  const ruc = document.getElementById('clienteRuc').value.trim();
  const nombre = document.getElementById('clienteNombre').value.trim();
  
  if (!ruc || !nombre) {
    alert('❌ Complete RUC/DNI y Nombre');
    return;
  }
  
  // Verificar si ya existe
  const existe = clientes.find(c => c.ruc === ruc);
  
  if (existe) {
    // Actualizar
    const index = clientes.findIndex(c => c.ruc === ruc);
    clientes[index] = {
      ruc,
      nombre,
      email: document.getElementById('clienteEmail').value,
      telefono: document.getElementById('clienteTelefono').value,
      direccion: document.getElementById('clienteDireccion').value
    };
  } else {
    // Crear nuevo
    clientes.push({
      ruc,
      nombre,
      email: document.getElementById('clienteEmail').value,
      telefono: document.getElementById('clienteTelefono').value,
      direccion: document.getElementById('clienteDireccion').value
    });
  }
  
  localStorage.setItem('clientes', JSON.stringify(clientes));
  alert('✅ Cliente guardado exitosamente');
}

// GENERAR FACTURA
function generarFactura() {
  // VALIDACIONES
  const clienteRuc = document.getElementById('clienteRuc').value.trim();
  const clienteNombre = document.getElementById('clienteNombre').value.trim();
  const fechaEmision = document.getElementById('fechaEmision').value;
  
  if (!clienteRuc || !clienteNombre) {
    alert('❌ Complete los datos del cliente');
    return;
  }
  
  if (!fechaEmision) {
    alert('❌ Seleccione fecha de emisión');
    return;
  }
  
  if (itemsActuales.length === 0) {
    alert('❌ Agregue al menos un item');
    return;
  }
  
  // CREAR FACTURA
  let subtotal = 0;
  let descuentoTotal = 0;
  
  itemsActuales.forEach(item => {
    const totalItem = item.cantidad * item.precio;
    subtotal += totalItem;
    descuentoTotal += (totalItem * item.descuento) / 100;
  });
  
  const base = subtotal - descuentoTotal;
  const igv = base * 0.18;
  const total = base + igv;
  
  const factura = {
    id: Date.now(),
    numero: 'F001-' + String(numeroFacturaActual).padStart(6, '0'),
    serie: 'F001',
    fecha: fechaEmision,
    vencimiento: document.getElementById('fechaVencimiento').value,
    clienteRuc,
    clienteNombre,
    clienteEmail: document.getElementById('clienteEmail').value,
    clienteTelefono: document.getElementById('clienteTelefono').value,
    clienteDireccion: document.getElementById('clienteDireccion').value,
    items: JSON.parse(JSON.stringify(itemsActuales)),
    subtotal,
    descuentoTotal,
    base,
    igv,
    total,
    metodoPago: document.getElementById('metodoPago').value,
    notas: document.getElementById('notasFactura').value,
    estado: 'pendiente',
    fechaCreacion: new Date().toLocaleString('es-PE')
  };
  
  // Guardar factura
  facturas.push(factura);
  localStorage.setItem('facturas', JSON.stringify(facturas));
  numeroFacturaActual++;
  localStorage.setItem('numeroFactura', numeroFacturaActual);
  
  // Mostrar vista previa
  facturaActual = factura;
  mostrarFactura(factura);
  
  alert('✅ Factura #' + factura.numero + ' generada exitosamente');
}

// MOSTRAR FACTURA
function mostrarFactura(factura) {
  const preview = document.getElementById('facturaPreview');
  const metodoPagoNombre = factura.metodoPago === 'contado' ? 'Contado' :
                           factura.metodoPago === 'credito' ? 'Crédito' : 'Transferencia';
  
  let itemsHtml = '';
  factura.items.forEach(item => {
    const totalItem = item.cantidad * item.precio;
    const descuentoMonto = (totalItem * item.descuento) / 100;
    const neto = totalItem - descuentoMonto;
    
    itemsHtml += `
      <tr>
        <td>${item.descripcion}</td>
        <td class="text-right">${item.cantidad}</td>
        <td class="text-right">S/ ${item.precio.toFixed(2)}</td>
        <td class="text-right">S/ ${neto.toFixed(2)}</td>
      </tr>
    `;
  });
  
  preview.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1>FACTURA ELECTRÓNICA</h1>
      <h2>${factura.numero}</h2>
      <p>RUC: 20123456789</p>
    </div>
    
    <div style="margin-bottom: 20px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 10px 0;">
      <table style="width: 100%; margin-bottom: 10px;">
        <tr>
          <td><strong>Fecha:</strong> ${factura.fecha}</td>
          <td><strong>Vencimiento:</strong> ${factura.vencimiento}</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3>Cliente:</h3>
      <p><strong>${factura.clienteNombre}</strong></p>
      <p>RUC/DNI: ${factura.clienteRuc}</p>
      ${factura.clienteDireccion ? '<p>Dirección: ' + factura.clienteDireccion + '</p>' : ''}
      ${factura.clienteEmail ? '<p>Email: ' + factura.clienteEmail + '</p>' : ''}
    </div>
    
    <div style="margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="text-align: left; padding: 8px;">Descripción</th>
            <th style="text-align: right; padding: 8px;">Cantidad</th>
            <th style="text-align: right; padding: 8px;">Precio</th>
            <th style="text-align: right; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>
    
    <div style="margin-bottom: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
      <table style="width: 100%; margin-left: 50%;">
        <tr>
          <td>Subtotal:</td>
          <td style="text-align: right;">S/ ${factura.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Descuento:</td>
          <td style="text-align: right;">S/ ${factura.descuentoTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Base Imponible:</td>
          <td style="text-align: right;">S/ ${factura.base.toFixed(2)}</td>
        </tr>
        <tr>
          <td>IGV (18%):</td>
          <td style="text-align: right;">S/ ${factura.igv.toFixed(2)}</td>
        </tr>
        <tr style="border-top: 2px solid #000; font-weight: bold; font-size: 16px;">
          <td>TOTAL:</td>
          <td style="text-align: right;">S/ ${factura.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-top: 20px; padding: 10px; background: #f9f9f9;">
      <p><strong>Forma de Pago:</strong> ${metodoPagoNombre}</p>
      ${factura.notas ? '<p><strong>Notas:</strong> ' + factura.notas + '</p>' : ''}
      <p style="font-size: 12px; color: #666;">Gracias por su compra</p>
    </div>
  `;
  
  document.getElementById('modalFactura').style.display = 'flex';
}

// CERRAR MODAL
function cerrarModal() {
  document.getElementById('modalFactura').style.display = 'none';
}

// IMPRIMIR FACTURA
function imprimirFactura() {
  window.print();
}

// DESCARGAR PDF
function descargarPDF() {
  if (!facturaActual) {
    alert('❌ No hay factura para descargar');
    return;
  }
  
  const element = document.getElementById('facturaPreview');
  const opt = {
    margin: 10,
    filename: 'Factura_' + facturaActual.numero + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  
  html2pdf().set(opt).from(element).save();
}

// LIMPIAR FORMULARIO
function limpiarFormulario() {
  if (confirm('¿Está seguro de limpiar el formulario?')) {
    document.getElementById('clienteRuc').value = '';
    document.getElementById('clienteNombre').value = '';
    document.getElementById('clienteEmail').value = '';
    document.getElementById('clienteTelefono').value = '';
    document.getElementById('clienteDireccion').value = '';
    document.getElementById('itemDescripcion').value = '';
    document.getElementById('itemCantidad').value = '1';
    document.getElementById('itemPrecio').value = '0';
    document.getElementById('itemDescuento').value = '0';
    document.getElementById('notasFactura').value = '';
    itemsActuales = [];
    actualizarListaItems();
    actualizarResumen();
    alert('✅ Formulario limpiado');
  }
}

// ===================== HISTORIAL =====================

// CARGAR FACTURAS
function cargarFacturas() {
  actualizarTablaFacturas(facturas);
}

// ACTUALIZAR TABLA DE FACTURAS
function actualizarTablaFacturas(lista) {
  const tabla = document.getElementById('tablaFacturas');
  
  if (lista.length === 0) {
    tabla.innerHTML = '<tr><td colspan="6" class="empty-table">No hay facturas registradas</td></tr>';
    return;
  }
  
  let html = '';
  lista.forEach(factura => {
    const badgeClass = 'badge-' + factura.estado;
    const estadoTexto = factura.estado === 'pendiente' ? 'Pendiente' :
                        factura.estado === 'pagado' ? 'Pagado' : 'Cancelado';
    
    html += `
      <tr>
        <td><strong>${factura.numero}</strong></td>
        <td>${factura.clienteNombre}</td>
        <td>${factura.fecha}</td>
        <td>S/ ${factura.total.toFixed(2)}</td>
        <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-view" onclick="verFactura(${factura.id})">Ver</button>
            <button class="btn btn-sm btn-edit" onclick="cambiarEstado(${factura.id})">Cambiar</button>
            <button class="btn btn-sm btn-delete" onclick="eliminarFactura(${factura.id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  });
  
  tabla.innerHTML = html;
}

// VER FACTURA
function verFactura(id) {
  const factura = facturas.find(f => f.id === id);
  if (factura) {
    facturaActual = factura;
    mostrarFactura(factura);
  }
}

// CAMBIAR ESTADO
function cambiarEstado(id) {
  const estados = ['pendiente', 'pagado', 'cancelado'];
  const factura = facturas.find(f => f.id === id);
  
  if (!factura) return;
  
  const estadoActual = estados.indexOf(factura.estado);
  factura.estado = estados[(estadoActual + 1) % estados.length];
  
  localStorage.setItem('facturas', JSON.stringify(facturas));
  cargarFacturas();
  alert('✅ Estado actualizado a: ' + factura.estado.toUpperCase());
}

// ELIMINAR FACTURA
function eliminarFactura(id) {
  if (confirm('¿Está seguro de eliminar esta factura?')) {
    facturas = facturas.filter(f => f.id !== id);
    localStorage.setItem('facturas', JSON.stringify(facturas));
    cargarFacturas();
    actualizarEstadisticas();
    alert('✅ Factura eliminada');
  }
}

// FILTRAR FACTURAS
function filtrarFacturas() {
  const busqueda = document.getElementById('buscarFactura').value.toLowerCase();
  const estado = document.getElementById('filtroEstado').value;
  
  const filtrados = facturas.filter(f => {
    const cumpleBusqueda = !busqueda ||
      f.numero.toLowerCase().includes(busqueda) ||
      f.clienteNombre.toLowerCase().includes(busqueda) ||
      f.clienteRuc.includes(busqueda);
    
    const cumpleEstado = !estado || f.estado === estado;
    
    return cumpleBusqueda && cumpleEstado;
  });
  
  actualizarTablaFacturas(filtrados);
}

// ===================== REPORTES =====================

// CARGAR REPORTES
function cargarReportes() {
  const hoy = new Date();
  const hace30 = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  document.getElementById('reporteFechaInicio').value = hace30.toISOString().split('T')[0];
  document.getElementById('reporteFechaFin').value = hoy.toISOString().split('T')[0];
}

// GENERAR REPORTE
function generarReporte() {
  const fechaInicio = document.getElementById('reporteFechaInicio').value;
  const fechaFin = document.getElementById('reporteFechaFin').value;
  
  if (!fechaInicio || !fechaFin) {
    alert('❌ Seleccione fechas');
    return;
  }
  
  const filtrados = facturas.filter(f => f.fecha >= fechaInicio && f.fecha <= fechaFin);
  
  if (filtrados.length === 0) {
    alert('ℹ️ No hay facturas en este período');
    return;
  }
  
  // Calcular
  let totalMonto = 0;
  let totalIGV = 0;
  
  filtrados.forEach(f => {
    totalMonto += f.total;
    totalIGV += f.igv;
  });
  
  const promedio = totalMonto / filtrados.length;
  
  // Mostrar resultados
  document.getElementById('reporteFacturas').textContent = filtrados.length;
  document.getElementById('reporteMonto').textContent = 'S/ ' + totalMonto.toFixed(2);
  document.getElementById('reportePromedio').textContent = 'S/ ' + promedio.toFixed(2);
  document.getElementById('reporteIGV').textContent = 'S/ ' + totalIGV.toFixed(2);
  document.getElementById('reporteResultado').style.display = 'block';
  
  // Top clientes
  const topClientesObj = {};
  filtrados.forEach(f => {
    if (!topClientesObj[f.clienteNombre]) {
      topClientesObj[f.clienteNombre] = { monto: 0, count: 0 };
    }
    topClientesObj[f.clienteNombre].monto += f.total;
    topClientesObj[f.clienteNombre].count++;
  });
  
  const topClientesArr = Object.entries(topClientesObj)
    .map(([nombre, data]) => ({ nombre, monto: data.monto, count: data.count }))
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5);
  
  let topHtml = '';
  topClientesArr.forEach((cliente, index) => {
    topHtml += `
      <div class="top-item">
        <div class="top-rank">#${index + 1}</div>
        <div class="top-info">
          <div class="top-name">${cliente.nombre}</div>
          <div class="top-monto">${cliente.count} factura(s)</div>
        </div>
        <div class="top-value">S/ ${cliente.monto.toFixed(2)}</div>
      </div>
    `;
  });
  
  document.getElementById('topClientes').innerHTML = topHtml || '<div class="empty-state"><span>Sin datos</span></div>';
}

// ===================== ESTADÍSTICAS =====================

// ACTUALIZAR ESTADÍSTICAS
function actualizarEstadisticas() {
  const hoy = new Date().toISOString().split('T')[0];
  const facturasHoy = facturas.filter(f => f.fecha === hoy).length;
  const totalIngresos = facturas.reduce((sum, f) => sum + f.total, 0);
  
  document.getElementById('facturasHoy').textContent = facturasHoy;
  document.getElementById('totalIngresos').textContent = 'S/ ' + totalIngresos.toFixed(2);
}

// Inicializar
cargarFacturas();
actualizarEstadisticas();
