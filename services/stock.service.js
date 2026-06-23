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
        garantiaActivo,
        garantiaDuracion,
        reparado,
        tipoReparacion,
        empresaReparadora,
        tecnicoReparador
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `,[
      d.producto || '',
      d.marca || '',
      d.modelo || '',
      d.numeroSerie || '',
      d.estado || '',
      d.fechaIngresoStock || '',
      d.garantiaActivo || '',
      d.garantiaDuracion || '',
      d.reparado || '',
      d.tipoReparacion || '',
      d.empresaReparadora || '',
      d.tecnicoReparador || ''
    ],function(err){

      if(err) return reject(err);

      resolve({
        ok:true,
        id:this.lastID
      });

    });

  });

}

return{
  listar,
  crear
};

};