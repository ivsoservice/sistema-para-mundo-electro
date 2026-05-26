const express = require('express');
const bcrypt = require('bcrypt');

function onlyAdmin(req,res,next){

  if(!req.session.user || req.session.user.role !== 'admin'){
    return res.status(403).json({error:'forbidden'});
  }

  next();
}

module.exports = (db, auth, logAction) => {

  const router = express.Router();

  // LISTAR
  router.get('/', auth, (req, res) => {

    db.all(
      "SELECT id, username, role FROM users",
      (err, rows) => {

        if(err){
          return res.status(500).json({
            error:'Error obteniendo usuarios'
          });
        }

        res.json(rows);

      }
    );

  });

  // CREAR
  router.post('/', auth, onlyAdmin, (req, res) => {

    const { username, password, role } = req.body;

    if(!username || !password || !role){
      return res.status(400).json({
        error:'Faltan datos'
      });
    }

    const hash = bcrypt.hashSync(password.toString(),10);

    db.run(`
      INSERT INTO users
      (username,password,role)
      VALUES (?,?,?)
    `,[
      username,
      hash,
      role
    ], function(err){

      if(err){

        if(err.message.includes('UNIQUE')){
          return res.status(400).json({
            error:'El usuario ya existe'
          });
        }

        return res.status(500).json({
          error:'Error creando usuario'
        });

      }

      logAction(
        req.session?.user?.username || 'sistema',
        'CREATE_USER',
        username
      );

      res.json({
        ok:true
      });

    });

  });

  // EDITAR
  router.put('/:id', auth, onlyAdmin, (req, res) => {

    const { username, password, role } = req.body;

    if(password){

      const hash = bcrypt.hashSync(password,10);

      db.run(`
        UPDATE users
        SET username=?, password=?, role=?
        WHERE id=?
      `,[
        username,
        hash,
        role,
        req.params.id
      ], (err)=>{

        if(err){
          return res.status(500).json({
            error:'Error editando usuario'
          });
        }

        logAction(
          req.session?.user?.username || 'sistema',
          'EDIT_USER',
          username
        );

        res.json({ ok:true });

      });

    } else {

      db.run(`
        UPDATE users
        SET username=?, role=?
        WHERE id=?
      `,[
        username,
        role,
        req.params.id
      ], (err)=>{

        if(err){
          return res.status(500).json({
            error:'Error editando usuario'
          });
        }

        logAction(
          req.session?.user?.username || 'sistema',
          'EDIT_USER',
          username
        );

        res.json({ ok:true });

      });

    }

  });

  // BORRAR
  router.delete('/:id', auth, onlyAdmin, (req, res) => {

    db.run(
      "DELETE FROM users WHERE id=?",
      [req.params.id],
      (err)=>{

        if(err){
          return res.status(500).json({
            error:'Error eliminando usuario'
          });
        }

        logAction(
          req.session?.user?.username || 'sistema',
          'DELETE_USER',
          req.params.id,
          'WARN'
        );

        res.json({ ok:true });

      }
    );

  });

  return router;

};