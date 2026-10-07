function nuevaOrden(){
  ordenActualId = null;

  document.getElementById('osNumero').value = '';
  document.getElementById('osCaso').value = '';

  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('osFecha').value = hoy;

  document.getElementById('osCliente').value = '';
  document.getElementById('osTelefono').value = '';

  document.getElementById('osDireccion').value = '';
  document.getElementById('osLocalidad').value = '';
  document.getElementById('osEntreCalles').value = '';

  document.getElementById('osProducto').value = '';
  document.getElementById('osMarca').value = '';
  document.getElementById('osAccesorios').value = '';
  document.getElementById('osModelo').value = '';
  document.getElementById('osSerie').value = '';

  document.getElementById('osFalla').value = '';
  document.getElementById('osTarea').value = '';
  document.getElementById('osObservaciones').value = '';

  $('#modalOrden').modal('show');

}

function crearOrdenDesdeTicket(){

  // LIMPIAR TODO
  document.getElementById('osNumero').value = '';
  document.getElementById('osTelefono').value = '';
  document.getElementById('osDireccion').value = '';
  document.getElementById('osLocalidad').value = '';
  document.getElementById('osEntreCalles').value = '';
  document.getElementById('osAccesorios').value = '';
  document.getElementById('osModelo').value = '';
  document.getElementById('osSerie').value = '';
  document.getElementById('osFalla').value = '';
  document.getElementById('osTarea').value = '';
  document.getElementById('osObservaciones').value = '';

  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('osFecha').value = hoy;

  document.getElementById('osCaso').value =
    document.getElementById('dCaso').innerText;

  document.getElementById('osCliente').value =
    document.getElementById('dCliente').innerText;

  document.getElementById('osProducto').value =
    document.getElementById('dTitulo').innerText;

  document.getElementById('osMarca').value =
    document.getElementById('dMarca').innerText;

  $('#modalOrden').modal('show');
}

async function cargarOrdenes(){

  try{

    const res = await fetch('/api/ordenes-servicio');

    const data = await res.json();

    const tbody =
    document.querySelector('#tablaOrdenes tbody');

    tbody.innerHTML = '';

    data.forEach(o => {

tbody.innerHTML += `
  <tr onclick="verOrden(${o.id})" style="cursor:pointer;">
    <td>${o.numeroOrden}</td>
    <td>${o.numeroCaso}</td>
    <td>${o.cliente}</td>
    <td>${o.fecha}</td>
  </tr>
`;
    });

  }catch(err){

    console.log(err);

  }

}

async function verOrden(id){

  ordenActualId = id;

  try{

    const res = await fetch(
      '/api/ordenes-servicio/' + id
    );

    const orden = await res.json();
console.log("ORDEN CARGADA:", orden);

    document.getElementById('osNumero').value =
      orden.numeroOrden || '';

    document.getElementById('osCaso').value =
      orden.numeroCaso || '';

    document.getElementById('osFecha').value =
      orden.fecha || '';

    document.getElementById('osCliente').value =
      orden.cliente || '';

    document.getElementById('osTelefono').value =
      orden.telefono || '';

    document.getElementById('osDireccion').value =
      orden.direccion || '';

    document.getElementById('osLocalidad').value =
      orden.localidad || '';

    document.getElementById('osEntreCalles').value =
      orden.entreCalles || '';

    document.getElementById('osProducto').value =
      orden.producto || '';

    document.getElementById('osMarca').value =
      orden.marca || '';

    document.getElementById('osAccesorios').value =
      orden.accesorios || '';

    document.getElementById('osModelo').value =
      orden.modelo || '';

    document.getElementById('osSerie').value =
      orden.serie || '';


    document.getElementById('osFalla').value =
      orden.falla || '';
      
    document.getElementById('osTarea').value =
      orden.tarea || '',

    document.getElementById('osObservaciones').value =
      orden.observaciones || '';

    document.getElementById('osUsuarioCreacion').value =
      orden.usuarioCreacion || '';

    console.log(
  "CAMPO OCULTO:",
  document.getElementById('osUsuarioCreacion').value
);

    $('#modalOrden').modal('show');

  }catch(err){

    console.log(err);

  }

}

function validarImpresionOrden(){

  if(!ordenActualId){

    const guardarAhora = confirm(
      'La orden todavía no fue guardada.\n\nDebe guardar la orden para generar el número de Orden de Servicio antes de imprimir.\n\n¿Desea guardar ahora?'
    );

    if(guardarAhora){
      guardarOrdenServicio();
    }

    return;
  }

  imprimirOrden();

}

function imprimirOrden(){

console.log(
  "USUARIO AL IMPRIMIR:",
  document.getElementById('osUsuarioCreacion').value
);

  const contenido = `
    <html>
    <head>
      <title>Orden de Servicio</title>
      <style>

        body{
  font-family: Arial, sans-serif;
  padding:20px;
  font-size:13px;
}

table{
  width:100%;
  border-collapse:collapse;
}

td{
  border:1px solid #999;
  padding:8px;
  vertical-align:top;
}

.seccion{
  font-weight:bold;
  text-align:center;
  font-size:14px;
  border-top:2px solid #000;
  border-bottom:2px solid #000;
  background:none;
  letter-spacing:1px;
}

.etiqueta{
  width:30%;
  font-weight:bold;
  background:#f5f5f5;
}

      </style>
    </head>

    <body>

    <div id="original">

      <div style="margin-bottom:15px;">

  <table style="
    width:100%;
    border:none;
    margin-bottom:10px;
  ">

    <tr>

      <td style="
        border:none;
        width:20%;
        text-align:left;
        vertical-align:middle;
      ">
        <img
          src="/img/logo.png"
          style="
            width:110px;
          ">
      </td>

      <td style="
        border:none;
        width:80%;
        vertical-align:middle;
      ">

        <div style="
          font-size:28px;
          font-weight:bold;
        ">
          MUNDO ELECTRO
        </div>

        <div style="
          font-size:18px;
          font-weight:bold;
        ">
          ORDEN DE SERVICIO
        </div>

        <div style="
          margin-top:10px;
          font-size:13px;
        ">
          <b>Razón Social:</b> MUNDO ELECTRO MG S.A.S
          &nbsp;&nbsp;&nbsp;
          <b>CUIT:</b> 30-71645082-8
        </div>

        <div style="
          font-size:13px;
          margin-top:3px;
        ">
          <b>Email:</b> service.mundo.electro@gmail.com
          &nbsp;&nbsp;&nbsp;
          <b>WhatsApp:</b> 1136861103 / 1171982245
        </div>

      </td>

    </tr>

  </table>

  <hr style="margin:10px 0;">

</div>

</div>
      <table>

        <tr>
  <td colspan="2" class="seccion">
    DATOS DE RECEPCIÓN
  </td>
</tr>


        <tr>

  <td colspan="2" style="padding:0;">

    <table style="width:100%; border-collapse:collapse;">

      <tr>

        <td style="
          width:33%;
          text-align:center;
          font-weight:bold;
        ">
          N° ORDEN
          <br><br>
          ${document.getElementById('osNumero').value}
        </td>

        <td style="
          width:33%;
          text-align:center;
          font-weight:bold;
        ">
          N° CASO
          <br><br>
          ${document.getElementById('osCaso').value}
        </td>

        <td style="
          width:34%;
          text-align:center;
          font-weight:bold;
        ">
          FECHA
          <br><br>
          ${document.getElementById('osFecha').value}
        </td>

      </tr>

    </table>

  </td>

</tr>

        <tr>
  <td colspan="2" class="seccion">
    DATOS DEL CLIENTE
  </td>
</tr>
        

        <tr>
          <td class="etiqueta">Cliente</td>
          <td>${document.getElementById('osCliente').value}</td>
        </tr>
  
        <tr>
          <td class="etiqueta">Creado por</td>
          <td>${document.getElementById('osUsuarioCreacion').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Telefono</td>
          <td>${document.getElementById('osTelefono').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Dirección</td>
          <td>${document.getElementById('osDireccion').value}</td>
         </tr>

        <tr>
          <td class="etiqueta">Localidad</td>
          <td>${document.getElementById('osLocalidad').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Entre Calles</td>
          <td>${document.getElementById('osEntreCalles').value}</td>
        </tr>

        <tr>
  <td colspan="2" class="seccion">
    DATOS DEL EQUIPO
  </td>
</tr>

        <tr>
          <td class="etiqueta">Producto</td>
          <td>${document.getElementById('osProducto').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Marca</td>
          <td>${document.getElementById('osMarca').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Observaciones</td>
          <td>${document.getElementById('osAccesorios').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Modelo</td>
          <td>${document.getElementById('osModelo').value}</td>
        </tr>

        <tr>
          <td class="etiqueta">Serie</td>
          <td>${document.getElementById('osSerie').value}</td>
        </tr>

        <tr>
  <td colspan="2" class="seccion">
    INFORMACIÓN DEL SERVICIO
  </td>
</tr>

<tr>

  <td style="
    width:50%;
    font-weight:bold;
    text-align:center;
  ">
    FALLA REPORTADA
  </td>

  <td style="
    width:50%;
    font-weight:bold;
    text-align:center;
  ">
    TAREA A REALIZAR
  </td>

</tr>

<tr>

  <td style="height:70px;">
    ${document.getElementById('osFalla').value}
  </td>

  <td style="height:70px;">
    ${document.getElementById('osTarea').value}
  </td>

</tr>

<tr>
  <td colspan="2" style="font-weight:bold;">
    MODIFICACIÓN DE CRÉDITO
  </td>
</tr>

<tr>
  <td colspan="2" style="height:40px;">
    ${document.getElementById('osObservaciones').value}
  </td>
</tr>

      </table>

<br>

<table style="width:100%; border:none;">

  <tr>

    <td style="
      border:none;
      text-align:center;
      width:50%;
    ">
      ___________________________
      <br>
      Firma y Aclaracion del Cliente
    </td>

    <td style="
      border:none;
      text-align:center;
      width:50%;
    ">
      ___________________________
      <br>
      Firma y Sello del Asistencia Tecnica
    </td>

  </tr>

</table>

<div style="
  font-size:11px;
  margin-top:10px;
  line-height:1.5;
">

  <b>Horario de Atención:</b>
  Lunes a Viernes de 09:00 a 17:00 hs.

  <br><br>

  <b>Condiciones de Recepción:</b>
  El cliente declara haber realizado el resguardo de toda la información importante contenida en el equipo antes de su ingreso al servicio técnico. MUNDO ELECTRO no se responsabiliza por la pérdida total o parcial de datos almacenados en teléfonos celulares, tablets, notebooks, computadoras, discos, memorias o cualquier otro dispositivo de almacenamiento. Asimismo, la empresa no se responsabiliza por la pérdida, extravío o faltante de accesorios, componentes o elementos que no hayan sido expresamente detallados en la presente Orden de Servicio al momento de la recepción del equipo.

</div>

</div>

</body>
</html>

</div>



    </body>
    </html>
  `;

  const ventana = window.open('', '_blank');

ventana.document.write(contenido);

ventana.document.close();

setTimeout(() => {

  ventana.print();

}, 500);

}


function guardarOrdenServicio(){

  const orden = {

    numero: document.getElementById('osNumero').value,
    caso: document.getElementById('osCaso').value,
    fecha: document.getElementById('osFecha').value,

    cliente: document.getElementById('osCliente').value,
    telefono: document.getElementById('osTelefono').value,
    direccion: document.getElementById('osDireccion').value,
    localidad: document.getElementById('osLocalidad').value,
    entreCalles: document.getElementById('osEntreCalles').value,
    producto: document.getElementById('osProducto').value,
    marca: document.getElementById('osMarca').value,

    accesorios: document.getElementById('osAccesorios').value,
    modelo: document.getElementById('osModelo').value,
    serie: document.getElementById('osSerie').value,


    falla: document.getElementById('osFalla').value,
    tarea: document.getElementById('osTarea').value,
    observaciones: document.getElementById('osObservaciones').value

  };

let url = '/api/ordenes-servicio';
let method = 'POST';

if(ordenActualId){
  url = '/api/ordenes-servicio/' + ordenActualId;
  method = 'PUT';
}

fetch(url, {
  credentials: 'include',
  method: method,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orden)
})
.then(r => r.json())
.then(data => {

  console.log(data);

if(data.numeroOrden){
  document.getElementById('osNumero').value =
    data.numeroOrden;
}

if(data.id){
  ordenActualId = data.id;
}

  alert('Orden enviada correctamente');

  cargarOrdenes();

})
.catch(err => {

  console.log(err);

  alert('Error enviando orden');

});

}

function eliminarOrdenServicio(){

  if(!ordenActualId){
    alert('Primero abrí una orden guardada');
    return;
  }

  if(!confirm('¿Eliminar esta Orden de Servicio?')){
    return;
  }

  fetch('/api/ordenes-servicio/' + ordenActualId,{
    credentials:'include',
    method:'DELETE'
  })
  .then(r=>r.json())
  .then(data=>{

    if(!data.ok){
      alert('Error eliminando');
      return;
    }

    $('#modalOrden').modal('hide');

    ordenActualId = null;

    cargarOrdenes();

    alert('Orden eliminada');

  })
  .catch(err=>{

    console.log(err);

    alert('Error eliminando');

  });

}