module.exports = (db) => {

function listar(){

  return new Promise((resolve,reject)=>{

    db.all(`
      SELECT *
      FROM stock_service
      ORDER BY id DESC
    `,[],(err,rows)=>{

      if(err) return reject(err);

      resolve(rows);

    });

  });

}

function crear(d){

  return new Promise((resolve,reject)=>{

    db.run(`
      INSERT INTO stock_service
      (
        producto,
        marca,
        modelo,
        numeroSerie,
        estado,
        fechaIngresoStock,
        procedencia,
        garantiaActivo,
        garantiaDuracion,
        reparado,
        tipoReparacion,
        empresaReparadora,
        tecnicoReparador,
        estadoEstetico,
        accesorios,
        faltantes,
        detallesTecnicos,
        comentariosInternos
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,[
      d.producto || '',
      d.marca || '',
      d.modelo || '',
      d.numeroSerie || '',
      d.estado || '',
      d.fechaIngresoStock || '',
      d.procedencia || '',
      d.garantiaActivo || '',
      d.garantiaDuracion || '',
      d.reparado || '',
      d.tipoReparacion || '',
      d.empresaReparadora || '',
      d.tecnicoReparador || '',
      d.estadoEstetico || '',
      d.accesorios || '',
      d.faltantes || '',
      d.detallesTecnicos || '',
      d.comentariosInternos || ''
    ],function(err){

      if(err) return reject(err);

      resolve({
        ok:true,
        id:this.lastID
      });

    });

  });

}

function eliminar(id){

  return new Promise((resolve,reject)=>{

    db.run(
      `DELETE FROM stock_service WHERE id=?`,
      [id],
      (err)=>{

        if(err) return reject(err);

        resolve({ok:true});

      }
    );

  });

}

function actualizar(id,d){

  return new Promise((resolve,reject)=>{

    db.run(`
      UPDATE stock_service
      SET
        producto=?,
        marca=?,
        modelo=?,
        numeroSerie=?,
        estado=?,
        fechaIngresoStock=?,
        procedencia=?,
        garantiaActivo=?,
        garantiaDuracion=?,
        reparado=?,
        tipoReparacion=?,
        empresaReparadora=?,
        tecnicoReparador=?,
        estadoEstetico=?,
        accesorios=?,
        faltantes=?,
        detallesTecnicos=?,
        comentariosInternos=?
      WHERE id=?
    `,[

      d.producto || '',
      d.marca || '',
      d.modelo || '',
      d.numeroSerie || '',
      d.estado || '',
      d.fechaIngresoStock || '',
      d.procedencia || '',
      d.garantiaActivo || '',
      d.garantiaDuracion || '',
      d.reparado || '',
      d.tipoReparacion || '',
      d.empresaReparadora || '',
      d.tecnicoReparador || '',
      d.estadoEstetico || '',
      d.accesorios || '',
      d.faltantes || '',
      d.detallesTecnicos || '',
      d.comentariosInternos || '',
      id

    ],function(err){

      if(err) return reject(err);

      resolve({ok:true});

    });

  });

}

return{
  listar,
  crear,
  actualizar,
  eliminar
};

};