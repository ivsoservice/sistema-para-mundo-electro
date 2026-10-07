fetch('modules/historial/historial.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('moduloHistorial').innerHTML = html;
  });