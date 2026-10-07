fetch('modules/contactos/contactos.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('moduloContactos').innerHTML = html;
  });