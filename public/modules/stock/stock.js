function cargarStock(){

  fetchAuth('/api/stock-service')
  .then(r => r.json())
  .then(data => {

    console.log("STOCK:", data);

    const tabla =
    document.getElementById('stockTabla');

    if(!tabla) return;

tabla.innerHTML = '';

const body = tabla;

    if(!Array.isArray(data)) return;

    const texto = document.getElementById('buscarStock').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value;
    const procedencia = document.getElementById('filtroProcedencia').value;
    const garantia = document.getElementById('filtroGarantia').value;

    data
.filter(s => {

const coincideBusqueda =

  (s.producto || '').toLowerCase().includes(texto) ||
  (s.marca || '').toLowerCase().includes(texto) ||
  (s.modelo || '').toLowerCase().includes(texto) ||
  (s.numeroSerie || '').toLowerCase().includes(texto);

const coincideEstado =
  !estado || s.estado === estado;

const coincideProcedencia =
  !procedencia || s.procedencia === procedencia;

const coincideGarantia =
  !garantia || s.garantiaActivo === garantia;

return (
  coincideBusqueda &&
  coincideEstado &&
  coincideProcedencia &&
  coincideGarantia
);

})


.forEach(s => {

    body.innerHTML += generarCardStock(s);

});

})

  .catch(err => {
    console.log(err);
  });
}

function generarCardStock(s){

    return `

<div class="stock-card">

    <div class="stock-header">

        <div>

            <div class="stock-title">
                📦 ${s.producto || '-'}
            </div>

            <div class="stock-id">
                ID #${s.id}
            </div>

        </div>

        <div>

            <span class="${
                s.estado === 'Nuevo' ? 'badge-estado estado-nuevo' :
                s.estado === 'Semi Nuevo' ? 'badge-estado estado-semi' :
                s.estado === 'Usado' ? 'badge-estado estado-usado' :
                s.estado === 'Reparable' ? 'badge-estado estado-reparable' :
                'badge-estado estado-repuesto'
            }">

                ${s.estado || '-'}

            </span>

        </div>

    </div>

    <div class="stock-body">

        <div class="stock-grid">

            <div>

                <div class="stock-item">
                    <div class="stock-label">Marca</div>
                    <div class="stock-value">${s.marca || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Modelo</div>
                    <div class="stock-value">${s.modelo || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Número de Serie</div>
                    <div class="stock-value">${s.numeroSerie || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Procedencia</div>
                    <div class="stock-value">📍 ${s.procedencia || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Fecha de ingreso</div>
                    <div class="stock-value">${s.fechaIngresoStock || '-'}</div>
                </div>

            </div>

            <div>

                <div class="stock-item">
                    <div class="stock-label">Garantía</div>

                    <div class="stock-value">

                        <span class="${
                            s.garantiaActivo === 'Si'
                            ? 'badge-garantia-si'
                            : 'badge-garantia-no'
                        }">

                            ${s.garantiaActivo === 'Si'
                                ? '✔ Con garantía'
                                : '✖ Sin garantía'}

                        </span>

                    </div>

                </div>

                <div class="stock-item">
                    <div class="stock-label">Duración</div>
                    <div class="stock-value">${s.garantiaDuracion || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Reparado</div>
                    <div class="stock-value">${s.reparado || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Técnico</div>
                    <div class="stock-value">${s.tecnicoReparador || '-'}</div>
                </div>

                <div class="stock-item">
                    <div class="stock-label">Estado estético</div>
                    <div class="stock-value">${s.estadoEstetico || '-'}</div>
                </div>

            </div>

        </div>

        <div class="stock-obs">

            <strong>📝 Observaciones</strong>

            <hr style="margin:8px 0;">

            ${s.observaciones || 'Sin observaciones.'}

            ${s.comentariosInternos
                ? `<br><br><strong>💬 Comentarios internos:</strong><br>${s.comentariosInternos}`
                : ''
            }

        </div>

        <div class="stock-actions">

            <button
                class="btn btn-info btn-sm"
                onclick="verStock(${s.id})">

                👁 Ver

            </button>

            <button
                class="btn btn-warning btn-sm"
                onclick="editarStock(${s.id})">

                ✏ Editar

            </button>

            <button
                class="btn btn-danger btn-sm"
                onclick="eliminarStock(${s.id})">

                🗑 Eliminar

            </button>

        </div>

    </div>

</div>

`;

}

function guardarStock(){

const url = stockEditando
  ? '/api/stock-service/' + stockEditando
  : '/api/stock-service';

const metodo = stockEditando
  ? 'PUT'
  : 'POST';

fetch(url,{
  credentials:'include',
  method: metodo,
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
  producto: document.getElementById('stockProducto').value,
  marca: document.getElementById('stockMarca').value,
  modelo: document.getElementById('stockModelo').value,
  numeroSerie: document.getElementById('stockNumeroSerie').value,
  estado: document.getElementById('stockEstado').value,
  fechaIngresoStock: document.getElementById('stockFechaIngreso').value,
  garantiaActivo: document.getElementById('stockGarantiaActivo').value,
  garantiaDuracion: document.getElementById('stockGarantiaDuracion').value,
  reparado: document.getElementById('stockReparado').value,
  tipoReparacion: document.getElementById('stockTipoReparacion').value,
  empresaReparadora: document.getElementById('stockEmpresaReparadora').value,
  tecnicoReparador: document.getElementById('stockTecnicoReparador').value,
  estadoEstetico: document.getElementById('stockEstadoEstetico').value,
  accesorios: document.getElementById('stockAccesorios').value,
  faltantes: document.getElementById('stockFaltantes').value,
  detallesTecnicos: document.getElementById('stockDetallesTecnicos').value,
  comentariosInternos: document.getElementById('stockComentariosInternos').value,
  procedencia: document.getElementById('stockProcedencia').value,
  })
})
.then(()=>{

  if(stockEditando){
    alert('Producto actualizado correctamente.');
  }else{
    alert('Producto agregado al stock.');
  }

  cargarStock();

  stockEditando = null;

  document.getElementById('stockEditandoInfo').style.display = 'none';

  console.log("Ocultando cartel...");

  document.getElementById('btnCancelarEdicion').style.display =
  'none';

  document.getElementById('btnGuardarStock').innerText =
  'Guardar';

  stockProducto.value='';
  stockMarca.value='';
  stockModelo.value='';
  stockNumeroSerie.value='';
  stockEstado.value='';
  stockFechaIngreso.value='';
  stockGarantiaActivo.value='';
  stockGarantiaDuracion.value='';
  stockReparado.value='';
  stockTipoReparacion.value='';
  stockEmpresaReparadora.value='';
  stockTecnicoReparador.value='';
  stockEstadoEstetico.value='';
  stockAccesorios.value='';
  stockFaltantes.value='';
  stockDetallesTecnicos.value='';
  stockComentariosInternos.value='';
});

}

function eliminarStock(id){

  if(!confirm('¿Eliminar este producto del stock?')){
    return;
  }

  fetch('/api/stock-service/' + id, {
    credentials:'include',
    method:'DELETE'
  })
  .then(r => r.json())
  .then(() => {
    cargarStock();
  });

}

function verStock(id){

  fetchAuth('/api/stock-service')
  .then(r => r.json())
  .then(data => {

    const s = data.find(x => x.id == id);

    if(!s) return;

    stockDetalleId = s.id;

    document.getElementById('sdProducto').innerText = s.producto || '-';
    document.getElementById('sdMarca').innerText = s.marca || '-';
    document.getElementById('sdModelo').innerText = s.modelo || '-';
    document.getElementById('sdSerie').innerText = s.numeroSerie || '-';
    document.getElementById('sdEstado').innerText = s.estado || '-';
    document.getElementById('sdProcedencia').innerText = s.procedencia || '-';
    document.getElementById('sdGarantia').innerText = s.garantiaActivo || '-';

    console.log(s);

    $('#stockDetalleModal').modal('show');

  });

}


function editarStock(id){

  fetchAuth('/api/stock-service')
  .then(r => r.json())
  .then(data => {

    const s = data.find(x => x.id == id);

    if(!s) return;

    stockEditando = id;

    const info = document.getElementById('stockEditandoInfo');

    info.style.display = 'block';

    info.innerHTML =
    `<strong>Editando:</strong> ${s.producto} - ${s.marca} ${s.modelo}`;

    document.getElementById('btnGuardarStock').innerText =
    'Actualizar Producto';

    document.getElementById('btnCancelarEdicion').style.display =
    'inline-block';

    stockProducto.value = s.producto || '';
    stockMarca.value = s.marca || '';
    stockModelo.value = s.modelo || '';
    stockNumeroSerie.value = s.numeroSerie || '';
    stockEstado.value = s.estado || '';
    stockFechaIngreso.value = s.fechaIngresoStock || '';
    stockProcedencia.value = s.procedencia || '';
    stockGarantiaActivo.value = s.garantiaActivo || '';
    stockGarantiaDuracion.value = s.garantiaDuracion || '';
    stockReparado.value = s.reparado || '';
    stockTipoReparacion.value = s.tipoReparacion || '';
    stockEmpresaReparadora.value = s.empresaReparadora || '';
    stockTecnicoReparador.value = s.tecnicoReparador || '';
    stockEstadoEstetico.value = s.estadoEstetico || '';
    stockAccesorios.value = s.accesorios || '';
    stockFaltantes.value = s.faltantes || '';
    stockDetallesTecnicos.value = s.detallesTecnicos || '';
    stockComentariosInternos.value = s.comentariosInternos || '';

    document.getElementById('stockProducto').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

  });

}


function cancelarEdicionStock(){

  stockEditando = null;

  stockProducto.value = '';
  stockMarca.value = '';
  stockModelo.value = '';
  stockNumeroSerie.value = '';
  stockEstado.value = '';
  stockFechaIngreso.value = '';
  stockProcedencia.value = '';
  stockGarantiaActivo.value = '';
  stockGarantiaDuracion.value = '';
  stockReparado.value = '';
  stockTipoReparacion.value = '';
  stockEmpresaReparadora.value = '';
  stockTecnicoReparador.value = '';
  stockEstadoEstetico.value = '';
  stockAccesorios.value = '';
  stockFaltantes.value = '';
  stockDetallesTecnicos.value = '';
  stockComentariosInternos.value = '';

  document.getElementById('btnGuardarStock').innerText =
  'Guardar';

  document.getElementById('btnCancelarEdicion').style.display =
  'none';

  document.getElementById('stockEditandoInfo').style.display = 'none';

  console.log("Cancelando edición...");

}

const buscarStock = document.getElementById('buscarStock');
const filtroEstado = document.getElementById('filtroEstado');
const filtroGarantia = document.getElementById('filtroGarantia');

if(buscarStock){
  buscarStock.addEventListener('input', cargarStock);
}

if(filtroEstado){
  filtroEstado.addEventListener('change', cargarStock);
}

if(filtroGarantia){
  filtroGarantia.addEventListener('change', cargarStock);
}