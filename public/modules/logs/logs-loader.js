fetch('modules/logs/logs.html')
.then(response => response.text())
.then(html => {
  document.getElementById('moduloLogs').innerHTML = html;
});