const express = require('express');

module.exports = (db, auth, logAction) => {
  
  console.log("ORDENES.ROUTES CARGADO");

  const router = express.Router();

  router.post('/', auth, async (req, res) => {
  
    console.log("BODY ORDEN:", req.body);

    try {

db.get(
  `SELECT COUNT(*) as total FROM ordenes_servicio`,
  [],
  (err, row) => {

    if(err){
      console.log(err);

      return res.status(500).json({
        ok:false
      });
    }

    const numeroOrden =
      'OS-' +
      String(row.total + 1).padStart(4,'0');

db.run(`
  INSERT INTO ordenes_servicio
  (
numeroOrden,
numeroCaso,
fecha,
cliente,
telefono,
direccion,
localidad,
entreCalles,
producto,
marca,
accesorios,
modelo,
serie,
falla,
tarea,
observaciones,
fechaCreacion,
usuarioCreacion
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`,
[
  numeroOrden,
  req.body.caso,
  req.body.fecha,
  req.body.cliente,
  req.body.telefono,
  req.body.direccion,
  req.body.localidad,
  req.body.entreCalles,
  req.body.producto,
  req.body.marca,
  req.body.accesorios,
  req.body.modelo,
  req.body.serie,
  req.body.falla,
  req.body.tarea,
  req.body.observaciones,
  new Date().toISOString(),
  (req.session?.user?.username || 'sistema')
],
function(err){

  if(err){
    console.log(err);

    return res.status(500).json({
      ok:false
    });
  }

  res.json({
    ok:true,
    id:this.lastID,
    numeroOrden: numeroOrden
  });

});

    });

    } catch (err) {

      console.log("ERROR GUARDANDO ORDEN:");
      console.log(err);

      res.status(500).json({
        ok: false,
        error: 'Error interno'
      });

    }
  });

router.get('/:id', auth, (req, res) => {

  db.get(`
    SELECT *
    FROM ordenes_servicio
    WHERE id = ?
  `,
  [req.params.id],
  (err, row) => {

    if(err){

      console.log(err);

      return res.status(500).json({
        ok:false
      });

    }

    res.json(row);

  });

});

router.get('/', auth, (req, res) => {

  db.all(`
    SELECT *
    FROM ordenes_servicio
    ORDER BY id DESC
  `,
  [],
  (err, rows) => {

    if(err){

      console.log("SESSION EN ORDERS:", req.session);

      return res.status(500).json({
        ok:false
      });

    }

    res.json(rows);

  });

});

  return router;

};