function cargarLogs(){

let url='/api/logs?';

if(fUser.value) url+='usuario='+fUser.value+'&';
if(fAccion.value) url+='accion='+fAccion.value+'&';
if(fDesde.value) url+='desde='+fDesde.value+'&';
if(fHasta.value) url+='hasta='+fHasta.value+'&';

fetchAuth(url)
.then(r => r.json())
.then(data => {

  listaLogs.innerHTML = '';

  data.forEach(l => {

    let color =
      l.nivel == 'ERROR' ? 'text-danger' :
      l.nivel == 'WARN' ? 'text-warning' : '';

    listaLogs.innerHTML += `
    <tr class="${color}">
      <td>${l.usuario}</td>
      <td>${l.accion}</td>
      <td>${l.detalle}</td>
      <td>${l.nivel}</td>
      <td>${new Date(l.fecha).toLocaleString()}</td>
    </tr>`;
  });

});

}

function exportLogs(){
window.location.href='/api/logs/export';
}
