const express = require('express');

const contactosService =
require('../services/contactos.service');

module.exports = (db, auth, logAction) => {

const router = express.Router();

const service = contactosService(db);

// LISTAR
router.get('/', auth, async(req,res)=>{

  try{

    const result = await service.listar();

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error listando contactos'
    });

  }

});

// CREAR
router.post('/', auth, async(req,res)=>{

  try{

    const result =
    await service.crear(req.body);

    logAction(
      req.session.user.username,
      'CREATE_CONTACT',
      result.id
    );

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error creando contacto'
    });

  }

});

// DELETE
router.delete('/:id', auth, async(req,res)=>{

  try{

    const result =
    await service.eliminar(req.params.id);

    logAction(
      req.session.user.username,
      'DELETE_CONTACT',
      req.params.id,
      'WARN'
    );

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error eliminando contacto'
    });

  }

});

return router;

};