fetch('modules/ordenes/ordenes.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('moduloOrdenes').innerHTML = html;
  });