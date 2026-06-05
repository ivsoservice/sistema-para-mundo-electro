module.exports = (db) => {

  function crearOrden(data) {

    return new Promise((resolve, reject) => {

      db.run(`
        INSERT INTO ordenes_servicio (
          numeroOrden,
          numeroCaso,
          fecha,
          cliente,
          producto,
          marca,
          accesorios,
          modelo,
          serie,
          estadoFisico,
          falla,
          observaciones,
          fechaCreacion
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,[
        data.numero || '',
        data.caso || '',
        data.fecha || '',
        data.cliente || '',
        data.producto || '',
        data.marca || '',
        data.accesorios || '',
        data.modelo || '',
        data.serie || '',
        data.estadoFisico || '',
        data.falla || '',
        data.observaciones || '',
        new Date().toISOString()
      ], function(err){

        if(err) return reject(err);

        resolve({
          ok:true,
          id:this.lastID
        });

      });

    });

  }

  return {
    crearOrden
  };

};