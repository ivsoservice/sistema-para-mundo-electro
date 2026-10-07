function fetchAuth(url, options = {}){

  options.credentials = 'include';

  return fetch(url, options)
  .then(r => {

    if(r.status === 401){

      logoutAuto();

      return Promise.reject("No autorizado");

    }

    return r;

  });

}

function login(){

  const u = document.getElementById('user').value;
  const p = document.getElementById('pass').value;

  fetch('/api/login',{
    credentials: 'include',
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      username:u,
      password:p
    })
  })
  .then(async r => {

    const data = await r.json();

    console.log(data);

    // ❌ si falla login
    if(!r.ok){
      document.getElementById('err').innerText =
        "Usuario o contraseña incorrecta";
      return;
    }

    // ✔ guardar rol
window.userRole = data.role;

// ✔ guardar username
window.username = data.username;

document.getElementById('usuarioActual').innerText =
  window.username;

document.getElementById('usuarioActual').innerText =
  window.username;

    // ✔ mostrar app
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    vista('panel');
    
// ✔ permisos UI
if(window.userRole !== 'admin'){

  document.getElementById('menuUsuarios').style.display = 'none';
  document.getElementById('menuLogs').style.display = 'none';
  document.getElementById('menuContactos').style.display = 'none';

}else{

  document.getElementById('menuUsuarios').style.display = 'block';
  document.getElementById('menuLogs').style.display = 'block';
  document.getElementById('menuContactos').style.display = 'block';

}

// ✔ cargar sistema
cargar();
cargarOrdenes();

// auto refresh
autoRefresh = setInterval(() => {

  if(
    tipoActual === 'diario' ||
    tipoActual === 'distribuidora'
  ){
    cargar();
  }

}, 3000);

  });

}

document.addEventListener("keydown",function(e){

if(e.key==="Enter" && loginBox.style.display!=="none"){

login();

}

});

function logoutAuto(){

  document.getElementById('app').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';

  alert('Sesión expirada. Volvé a iniciar sesión.');

}

