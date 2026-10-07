function cargarHistorial(){

fetch('/api/tickets/historial',{
  credentials:'include'
})
.then(r => r.json())
.then(data => {

  if (!Array.isArray(data)) return;

  listaHistorial.innerHTML='';

  data.forEach(t => {

    listaHistorial.innerHTML += `
    <tr>

      <td>${t.numeroCaso}</td>
      <td>${t.titulo}</td>

      <td>

        <button class="btn-modern btn-main"
        onclick="restaurar(${t.id})">
        Restaurar
        </button>

        <button class="btn-modern btn-main"
        onclick="imprimirTicket(${t.id})">
        Imprimir
        </button>

      </td>

    </tr>
    `;

  });

});

}

function restaurar(id){

  fetchAuth('/api/tickets/restore/' + id, {
    method:'PUT'
  })
  .then(async r => {

    if(!r.ok){
      const err = await r.text();
      console.log(err);
      alert("Error al restaurar");
      return;
    }

    cargarHistorial();
    cargar();

  })
  .catch(err => {
    console.log(err);
    alert("Error de conexión");
  });

}

