const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db, auth, logAction) => {

  const router = express.Router();

  // =========================
  // LISTAR USERS
  // =========================
  router.get('/', auth, (req, res) => {

    db.all(
      "SELECT id, username, role FROM users",
      (err, rows) => {

        if (err) {

          return res.status(500).json({
            error:'Error obteniendo usuarios'
          });

        }

        res.json(rows);

      }
    );

  });

  // =========================
  // CREAR USER
  // =========================
  router.post('/', auth, (req, res) => {

  const { username, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.run(`
    INSERT INTO users
    (username, password, role)
    VALUES (?, ?, ?)
  `, [
    username,
    hash,
    role
  ], function(err) {

    if (err) {
      return res.status(500).json({ error: 'Error creando usuario' });
    }

    if(req.session.user){
      logAction(
          req.session.user.username,
          'CREATE_USER',
          username
    );
}

    res.json({ ok: true });

  });

});

  // =========================
  // EDITAR USER
  // =========================
  router.put('/:id', auth, (req, res) => {

    const { username, password, role } = req.body;

    if (password) {

      const hash = bcrypt.hashSync(password, 10);

      db.run(`
        UPDATE users
        SET username=?,
        password=?,
        role=?
        WHERE id=?
      `, [
        username,
        hash,
        role,
        req.params.id
      ], (err) => {

        if(err){

          return res.status(500).json({
            error:'Error editando usuario'
          });

        }

        logAction(
          "test",
          'EDIT_USER',
          username
        );

        res.json({
          ok:true
        });

      });

    } else {

      db.run(`
        UPDATE users
        SET username=?,
        role=?
        WHERE id=?
      `, [
        username,
        role,
        req.params.id
      ], (err) => {

        if(err){

          return res.status(500).json({
            error:'Error editando usuario'
          });

        }

        logAction(
          req.session.user.username,
          'EDIT_USER',
          username
        );

        res.json({
          ok:true
        });

      });

    }

  });

  // =========================
  // DELETE USER
  // =========================
  router.delete('/:id', auth, (req, res) => {

    db.run(
      "DELETE FROM users WHERE id=?",
      [req.params.id],
      (err) => {

        if(err){

          return res.status(500).json({
            error:'Error eliminando usuario'
          });

        }

        logAction(
          req.session.user.username,
          'DELETE_USER',
          req.params.id,
          'WARN'
        );

        res.json({
          ok:true
        });

      }
    );

  });

  return router;

};