module.exports = (db) => {

function listar(){

  return new Promise((resolve,reject)=>{

    db.all(`
      SELECT *
      FROM contacts
      ORDER BY tipo,nombre
    `,[],(err,rows)=>{

      if(err) return reject(err);

      resolve(rows);

    });

  });

}

function crear(d){

  return new Promise((resolve,reject)=>{

    db.run(`
      INSERT INTO contacts
      (
        tipo,
        nombre,
        marca,
        telefono,
        direccion,
        notas
      )
      VALUES (?,?,?,?,?,?)
    `,[
      d.tipo || '',
      d.nombre || '',
      d.marca || '',
      d.telefono || '',
      d.direccion || '',
      d.notas || ''
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
      `DELETE FROM contacts WHERE id=?`,
      [id],
      (err)=>{

        if(err) return reject(err);

        resolve({ok:true});

      }
    );

  });

}

return{
  listar,
  crear,
  eliminar
};

};