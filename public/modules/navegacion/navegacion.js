function vista(v){

  const titulos = {

    panel:'Panel Principal',

    diario:'Pago Diario',

    distribuidora:'Distribuidora',

    historial:'Historial',

    usuarios:'Usuarios',

    logs:'Logs',

    contactos:'Contactos',

    ordenes:'Órdenes de Servicio',

    stock:'Stock Service'

  };


  document.getElementById('tituloVista').innerText = titulos[v];


  const modulos = {

    panel: 'moduloPanel',

    contactos: 'moduloContactos',

    ordenes: 'moduloOrdenes',

    diario: 'moduloTickets',

    distribuidora: 'moduloTickets',

    historial: 'moduloHistorial',

    usuarios: 'moduloUsuarios',

    logs: 'moduloLogs',

    stock: 'moduloStock'

  };


  Object.values(modulos).forEach(id => {

    const el = document.getElementById(id);

    if(el) el.style.display = 'none';

  });


  const actual = document.getElementById(modulos[v]);

  if(actual) actual.style.display = 'block';


  if(v === 'diario'){

    document.getElementById('diario').style.display = 'block';

    document.getElementById('distribuidora').style.display = 'none';

  }


  if(v === 'distribuidora'){

    document.getElementById('diario').style.display = 'none';

    document.getElementById('distribuidora').style.display = 'block';

  }


  document.querySelectorAll(
    '.card-box.bg-main, .card-box.bg-warn, .card-box.bg-ok'
  )
  .forEach(el => {

    el.style.display = (v === 'panel') ? '' : 'none';

  });


  const kpiPanel = document.getElementById('kpiPanel');

  if(kpiPanel){

    kpiPanel.style.display =
      (v === 'panel') ? 'flex' : 'none';

  }


  const buscadorTicketsPanel =
    document.getElementById('buscadorTicketsPanel');

  if(buscadorTicketsPanel){

    buscadorTicketsPanel.style.display =
      (v === 'panel')
        ? 'block'
        : 'none';

  }


  tipoActual = v;


  if(v === 'diario') paginaDiario = 1;

  if(v === 'distribuidora') paginaDistribuidora = 1;


  cargar();


  if(v === 'logs') cargarLogs();

  if(v === 'contactos') cargarContactos();

  if(v === 'historial') cargarHistorial();

  if(v === 'usuarios') cargarUsers();

}