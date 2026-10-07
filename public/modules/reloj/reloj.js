function actualizarReloj(){
  const ahora = new Date();

  const fecha = ahora.toLocaleDateString('es-AR');
  const hora = ahora.toLocaleTimeString('es-AR');

  const el = document.getElementById("relojSidebar");
  if(el){
    el.innerHTML = fecha + " " + hora;
  }
}

setInterval(actualizarReloj, 1000);
actualizarReloj();