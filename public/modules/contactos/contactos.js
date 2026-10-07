
function cargarContactos(){

  fetchAuth('/api/contactos')
  .then(r => r.json())
  .then(data => {

    console.log("CONTACTOS:", data);

    if (!Array.isArray(data)) return;

    const lista = document.getElementById('listaContactos');

    if(!lista) return;

    lista.innerHTML = '';

    data.forEach(c => {

      lista.innerHTML += `
      <tr>

        <td>
          <span class="badge badge-primary">
            ${c.tipo || '-'}
          </span>
        </td>

        <td>
          <b>${c.nombre || '-'}</b>
        </td>

        <td>
          ${c.marca || '-'}
        </td>

        <td>
          📞 ${c.telefono || '-'}
        </td>

        <td>
          ${c.email || '-'}
        </td>

        <td style="max-width:220px;">
          ${c.notas || '-'}
        </td>

        <td>
          <button
          class="btn-modern btn-danger"
          onclick="borrarContacto(${c.id})">
          Borrar
          </button>
        </td>

      </tr>
      `;

    });

  })
  .catch(err => {
    console.log(err);
  });

}

function crearContacto(){

fetch('/api/contactos',{

  credentials: 'include',

  method:'POST',

  headers:{
    'Content-Type':'application/json'
  },

  body:JSON.stringify({

    tipo: document.getElementById('cTipo').value,

    nombre: document.getElementById('cNombre').value,

    marca: document.getElementById('cMarca').value,

    telefono: document.getElementById('cTelefono').value,

    email: document.getElementById('cEmail').value,

    notas: document.getElementById('cNotas').value,

  })

})

.then(()=>{

  cargarContactos();
  cargar();

  cNombre.value='';
  cMarca.value='';
  cTelefono.value='';
  cEmail.value='';
  cNotas.value='';

});

}

function borrarContacto(id){

fetch('/api/contactos/'+id,{
  credentials:'include',
  method:'DELETE'
})
.then(()=>{
  cargarContactos();
  cargar();
})
.catch(err => console.log(err));

}