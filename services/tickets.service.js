module.exports = (db) => {

function listarTickets(tipo, page = 1) {

  return new Promise((resolve, reject) => {

    const limit = 20;
    const offset = (page - 1) * limit;

    db.get(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN tipo='diario' THEN 1 ELSE 0 END) as totalDiario,
        SUM(CASE WHEN tipo='distribuidora' THEN 1 ELSE 0 END) as totalDistribuidora,
        SUM(CASE WHEN estado='Ingresado' THEN 1 ELSE 0 END) as ingresados,
        SUM(CASE WHEN estado='En proceso' THEN 1 ELSE 0 END) as proceso,
        SUM(CASE WHEN estado='Resuelto' THEN 1 ELSE 0 END) as resueltos,

        SUM(CASE WHEN eliminado=1 THEN 1 ELSE 0 END) as eliminados
      FROM tickets
      
    `, (err, countResult) => {

      if (err) return reject(err);

      db.get(`
        SELECT COUNT(*) as totalTipo
        FROM tickets
        WHERE eliminado=0 AND tipo=?
      `, [tipo], (err, totalTipoResult) => {

        if (err) return reject(err);

        const totalPages =
        Math.ceil(totalTipoResult.totalTipo / limit);

        db.all(`
          SELECT *
          FROM tickets
          WHERE eliminado=0 AND tipo=?
          ORDER BY id DESC
          LIMIT ? OFFSET ?
        `, [tipo, limit, offset], (err, rows) => {

          if (err) return reject(err);

          resolve({
            tickets: rows,
            totalPages,
            currentPage: page,
            totalTickets: countResult.total,
            totalDiario: countResult.totalDiario || 0,
            totalDistribuidora:
            countResult.totalDistribuidora || 0,
            ingresados: countResult.ingresados || 0,
            proceso: countResult.proceso || 0,
            resueltos: countResult.resueltos || 0,
            eliminados: countResult.eliminados || 0
             
            
          });

        });

      });

    });

  });

}

function buscarTickets(q) {

  return new Promise((resolve, reject) => {

    const sql = `
      SELECT *
      FROM tickets
      WHERE eliminado=0
      AND (
        numeroCaso LIKE ?
        OR titulo LIKE ?
        OR cliente LIKE ?
        OR marca LIKE ?
        OR descripcion LIKE ?
      )
      ORDER BY id DESC
      LIMIT 50
    `;

    const value = `%${q}%`;

    db.all(
      sql,
      [value, value, value, value, value],
      (err, rows) => {

        if (err) return reject(err);

        resolve(rows);

      }
    );

  });

}

function crearTicket(d) {

  return new Promise((resolve, reject) => {

    const numeroCaso = null;
    const titulo = d.titulo || '';
    const cliente = d.cliente || '';
    const tipo = d.tipo || '';
    const descripcion = d.descripcion || '';
    const prioridad = d.prioridad || 'baja';

    db.run(`
  INSERT INTO tickets
  (
    numeroCaso,
    titulo,
    cliente,
    tipo,
    descripcion,
    prioridad,
    eliminado
  )
  VALUES (?, ?, ?, ?, ?, ?, 0)
`, [
  numeroCaso,
  titulo,
  cliente,
  tipo,
  descripcion,
  prioridad
], function(err) {

  if (err) return reject(err);

  db.run(
  `UPDATE tickets SET numeroCaso=? WHERE id=?`,
  ['CASO-' + String(this.lastID).padStart(4, '0'), this.lastID]
);

resolve({
  ok: true,
  id: this.lastID
});

});

  });

}

function obtenerTicket(id) {

  return new Promise((resolve, reject) => {

    db.get(
      `SELECT * FROM tickets WHERE id=?`,
      [id],
      (err, row) => {

        if (err) return reject(err);

        resolve(row);

      }
    );

  });

}

function editarTicket(id, d) {

  return new Promise((resolve, reject) => {

    db.run(`
      UPDATE tickets
      SET
      titulo=?,
      cliente=?,
      tipo=?,
      descripcion=?,
      prioridad=?,
      estado=?
      WHERE id=?
    `, [
      d.titulo || '',
      d.cliente || '',
      d.tipo || '',
      d.descripcion || '',
      d.prioridad || 'baja',
      d.estado || 'Ingresado',
      id
    ], (err) => {

      if (err) return reject(err);

      resolve({ ok: true });

    });

  });

}

function eliminarTicket(id) {

  return new Promise((resolve, reject) => {

    db.run(
      `UPDATE tickets SET eliminado=1 WHERE id=?`,
      [id],
      (err) => {

        if (err) return reject(err);

        resolve({
          ok:true
        });

      }
    );

  });

}

function restaurarTicket(id) {

  return new Promise((resolve, reject) => {

    db.run(
      `UPDATE tickets SET eliminado=0 WHERE id=?`,
      [id],
      (err) => {

        if (err) return reject(err);

        resolve({
          ok:true
        });

      }
    );

  });

}

function historialTickets() {

  return new Promise((resolve, reject) => {

    db.all(`
      SELECT *
      FROM tickets
      WHERE eliminado=1
      ORDER BY id DESC
    `, [], (err, rows) => {

      if (err) return reject(err);

      resolve(rows);

    });

  });

}

return {
  listarTickets,
  buscarTickets,
 crearTicket,
  obtenerTicket,
  editarTicket,
  eliminarTicket,
  restaurarTicket,
  historialTickets
};

};