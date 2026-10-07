// MI SISTEMA GRANDE EMPIEZA ACÁ
function cargar(){

  fetch('/api/tickets?tipo=' + tipoActual,{
    credentials:'include'
  })

const pagina = tipoActual === 'diario'
  ? paginaDiario
  : paginaDistribuidora;

fetch('/api/tickets?tipo=' + tipoActual + '&page=' + pagina,{

  credentials:'include'
})

.then(r => r.json())
.then(data => {

  

  if (!data || !data.tickets) return;

  listaDiario.innerHTML = '';
  listaDistribuidora.innerHTML = '';

  data.tickets.forEach(t => {

    let row = ` 
      <tr onclick="verDetalle(${t.id})">

        <td>${t.numeroCaso}</td>

        <td>${t.titulo}</td>

        <td>${t.cliente}</td>

        <td>${t.estado || 'Ingresado'}</td>

        <td>
          <span class="prio-${t.prioridad}">
            ${t.prioridad}
          </span>
        </td>

        <td>

          <button class="btn-modern btn-warn"
          onclick="event.stopPropagation(); editar(${t.id})">
          Editar
          </button>

          <button class="btn-modern btn-danger"
          onclick="event.stopPropagation(); borrar(${t.id})">
          Borrar
          </button>

          <button class="btn-modern btn-main"
          onclick="event.stopPropagation(); imprimirTicket(${t.id})">
          Imprimir
          </button>

        </td>

      </tr>
    `;

    if (t.tipo === 'diario'){
      listaDiario.innerHTML += row;
    }

    if (t.tipo === 'distribuidora'){
      listaDistribuidora.innerHTML += row;
    }

  });

  // CONTADORES

  if(document.getElementById('total')){
    document.getElementById('total').innerText =
      data.totalTickets || 0;
  }

  if(document.getElementById('cDiario')){
    document.getElementById('cDiario').innerText =
      data.totalDiario || 0;
  }

  if(document.getElementById('cDistribuidora')){
    document.getElementById('cDistribuidora').innerText =
      data.totalDistribuidora || 0;
  }

  if(document.getElementById('tIngresados')){
    document.getElementById('tIngresados').innerText =
      data.ingresados || 0;
  }

  if(document.getElementById('tProceso')){
    document.getElementById('tProceso').innerText =
      data.proceso || 0;
  }

  if(document.getElementById('tResueltos')){
    document.getElementById('tResueltos').innerText =
      data.resueltos || 0;
  }

  if(document.getElementById('tEliminados')){
    document.getElementById('tEliminados').innerText =
      data.eliminados || 0;
  }


})
.catch(err => {

  console.log("ERROR CARGAR:", err);

});

}

function abrir(tipo){

tipoTicket=tipo;
editId=null;

titulo.value='';
cliente.value='';
marca.value='';
fechaIngreso.value='';
tecnico.value='';
estado.value='Ingresado';
descripcion.value='';
prioridad.value='baja';

$('#modal').modal('show');

}

function cerrarModal(){
$('#modal').modal('hide');
}

function guardar(){

const data={
titulo:titulo.value,
cliente:cliente.value,
marca:marca.value,
fechaIngreso:fechaIngreso.value,
tecnico:tecnico.value,
descripcion:descripcion.value,
prioridad:prioridad.value,
estado:estado.value,
tipo:tipoTicket
};

let url='/api/tickets';
let method='POST';

if(editId){
url='/api/tickets/'+editId;
method='PUT';
}

fetch(url,{
  credentials: 'include',
  method:method,
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify(data)
})
.then(async r=>{

const res=await r.json();

if(!r.ok){
alert(res.error);
return;
}

$('#modal').modal('hide');
cargar();

})
.catch(()=>{

alert('Error de conexión o validación');

});

}

function editar(id){

fetchAuth('/api/tickets/' + id)
.then(r => r.json())
.then(t => {

  editId = id;
tipoTicket = t.tipo;


document.getElementById('titulo').value = t.titulo;
 document.getElementById('cliente').value = t.cliente;
 document.getElementById('marca').value = t.marca;
 document.getElementById('fechaIngreso').value = t.fechaIngreso;
 document.getElementById('tecnico').value = t.tecnico;
 document.getElementById('descripcion').value = t.descripcion;
 document.getElementById('estado').value = t.estado;
 document.getElementById('prioridad').value = t.prioridad;

  $('#modal').modal('show');

});

}

function verDetalle(id){

fetchAuth('/api/tickets/' + id)
.then(r => r.json())
.then(t => {

  console.log("DETALLE:", t);

  ticketDetalleId = t.id;

 document.getElementById('dCaso').innerText = t.numeroCaso;
 document.getElementById('dTitulo').innerText = t.titulo;
 document.getElementById('dCliente').innerText = t.cliente;
 document.getElementById('dMarca').innerText = t.marca;
 document.getElementById('dFecha').innerText = t.fechaIngreso;
 document.getElementById('dTecnico').innerText = t.tecnico;
 document.getElementById('dPrioridad').innerText = t.prioridad;
 document.getElementById('dEstado').innerText = t.estado;
 document.getElementById('dDesc').innerText = t.descripcion;

  $('#detalleModal').modal('show');

});

}

function editarDesdeDetalle(){

$('#detalleModal').modal('hide');

setTimeout(() => {

  editar(ticketDetalleId);

}, 300); 

}



function imprimirTicket(id){

fetchAuth('/api/tickets/' + id)
.then(r => r.json())
.then(t => {

  let ventana = window.open('', '_blank');

  let html = `
  <html>
  <head>
  <title>Ticket ${t.numeroCaso}</title>

  <style>
    body{
      font-family:Arial;
      padding:30px;
    }

    h2{
      border-bottom:2px solid #000;
      padding-bottom:10px;
    }

    p{
      font-size:18px;
      margin:10px 0;
    }
  </style>

  </head>

  <body>

  <h2>MUNDO ELECTRO</h2>

  <p><b>CASO:</b> ${t.numeroCaso}</p>
  <p><b>Producto:</b> ${t.titulo}</p>
  <p><b>Cliente:</b> ${t.cliente}</p>
  <p><b>Marca:</b> ${t.marca}</p>
  <p><b>Fecha:</b> ${t.fechaIngreso}</p>
  <p><b>Técnico:</b> ${t.tecnico}</p>
  <p><b>Prioridad:</b> ${t.prioridad}</p>
  <p><b>Estado:</b> ${t.estado}</p>
  <p><b>Descripción:</b> ${t.descripcion}</p>

  </body>
  </html>
  `;

  ventana.document.write(html);
  ventana.document.close();

  ventana.onload = function () {
    ventana.print();
  };

});

}

function borrar(id){

fetch('/api/tickets/delete/'+id,{
  credentials: 'include',
  method:'PUT'
})
.then(()=>cargar());

}

function siguientePagina(){


  if(tipoActual === 'diario'){

    paginaDiario++;

  }else{

    paginaDistribuidora++;

  }

  cargar();

}

function anteriorPagina(){

  if(tipoActual === 'diario'){

    if(paginaDiario > 1){

      paginaDiario--;

    }

  }else{

    if(paginaDistribuidora > 1){

      paginaDistribuidora--;

    }

  }

  cargar();

}