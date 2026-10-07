fetch('modules/tickets/tickets.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('moduloTickets').innerHTML = html;
  });