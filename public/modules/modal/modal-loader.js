fetch('modules/modal/modal.html')
.then(response => response.text())
.then(html => {
  document.getElementById('moduloModal').innerHTML = html;
});