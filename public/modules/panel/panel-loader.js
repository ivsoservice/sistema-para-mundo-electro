fetch('modules/panel/panel.html')

.then(response => response.text())

.then(html => {

  document.getElementById('moduloPanel').innerHTML = html;

  const buscador = document.getElementById("buscadorTickets");
  const resultados = document.getElementById("resultadosBusqueda");

  if(buscador && resultados){

    document.addEventListener('click', (e) => {

      const esBuscador = buscador.contains(e.target);
      const esResultados = resultados.contains(e.target);

      if(!esBuscador && !esResultados){

        buscador.value = '';
        resultados.innerHTML = '';

      }

    });

    buscador.addEventListener('keydown', (e) => {

      if(e.key === 'Escape'){

        buscador.value = '';
        resultados.innerHTML = '';

      }

    });

    let timeout = null;

    buscador.addEventListener('input', () => {

      clearTimeout(timeout);

      const q = buscador.value;

      if(q.length === 0){

        resultados.innerHTML = '';
        return;

      }

      timeout = setTimeout(async () => {

        try{

          const res = await fetch(
            '/api/tickets/search?q=' + encodeURIComponent(q),
            {
              credentials: 'include'
            }
          );

          const data = await res.json();

          resultados.innerHTML = data.map(t => {

            return `
              <div class="search-item"
                   onclick="verDetalle(${t.id})">

                <b>#${t.numeroCaso}</b>
                - ${t.titulo}

                <div style="font-size:12px;color:#666; margin-top:4px;">
                  ${t.cliente}
                  |
                  ${t.marca}
                  |
                  ${t.estado}
                </div>

              </div>
            `;

          }).join('');

        }catch(err){

          console.log("ERROR BUSCADOR:", err);

        }

      }, 300);

    });

  }

});