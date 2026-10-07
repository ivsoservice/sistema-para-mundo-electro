fetch('modules/stock/stock.html')
.then(response => response.text())
.then(html => {
  document.getElementById('moduloStock').innerHTML = html;
});