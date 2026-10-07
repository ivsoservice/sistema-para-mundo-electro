fetch('modules/usuarios/usuarios.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('moduloUsuarios').innerHTML = html;
  });