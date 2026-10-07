function cargarUsers(){

fetchAuth('/api/users')
.then(r => r.json())
.then(data => {

  if(!Array.isArray(data)) return;

  listaUsuarios.innerHTML = '';

  data.forEach(u => {

    listaUsuarios.innerHTML += `
    <tr>
      <td><input value="${u.username}" id="u${u.id}"></td>
      <td><input id="p${u.id}" placeholder="pass"></td>

      <td>
        <select id="r${u.id}">
          <option value="user" ${u.role=='user' ? 'selected' : ''}>user</option>
          <option value="admin" ${u.role=='admin' ? 'selected' : ''}>admin</option>
        </select>
      </td>

      <td>
        <button class="btn-modern btn-main" onclick="guardarUser(${u.id})">Guardar</button>
        <button class="btn-modern btn-danger" onclick="borrarUser(${u.id})">
        Borrar
        </button>
      </td>
    </tr>
    `;
  });

});

}

function guardarUser(id){

fetch('/api/users/'+id,{
  credentials: 'include',
  method:'PUT',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
    username:document.getElementById('u'+id).value,
    password:document.getElementById('p'+id).value,
    role:document.getElementById('r'+id).value
  })
})
.then(()=>cargarUsers());

}

function borrarUser(id){

fetch('/api/users/'+id,{
  credentials: 'include',
  method:'DELETE'
})
.then(()=>cargarUsers());

}

function crearUsuario(){



const u = newUser.value;



const p = newPass.value;



const r = newRole.value;



if(!u || !p || !r){



  alert("Completa todos los campos");



  return;



}



fetchAuth('/api/users',{



  credentials:'include',



  method:'POST',



  headers:{'Content-Type':'application/json'},



  body:JSON.stringify({



    username:u,



    password:p,



    role:r



  })



})



.then(async r => {



  const data = await r.json();



  if(!r.ok){



    alert(data.error);



    return;



  }



  cargarUsers();



})



.catch(err => console.log(err));



}