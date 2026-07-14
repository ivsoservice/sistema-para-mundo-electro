const express = require('express');

const stockService =
require('../services/stock.service');

module.exports = (db, auth, logAction) => {

const router = express.Router();

const service = stockService(db);

// LISTAR
router.get('/', auth, async(req,res)=>{

  try{

    const result =
    await service.listar();

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error listando stock'
    });

  }

});

// CREAR
router.post('/', auth, async(req,res)=>{

  try{

    console.log("ENTRO AL POST");
    console.log(req.body);

    const result =
    await service.crear(req.body);

    logAction(
      req.session.user.username,
      'CREATE_STOCK',
      result.id
    );

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error creando registro'
    });

  }

});

// ACTUALIZAR
router.put('/:id', auth, async(req,res)=>{

  try{

    const result =
    await service.actualizar(req.params.id, req.body);

    logAction(
      req.session.user.username,
      'UPDATE_STOCK',
      req.params.id,
      'INFO'
    );

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error actualizando producto'
    });

  }

});

// ELIMINAR
router.delete('/:id', auth, async(req,res)=>{

  try{

    const result =
    await service.eliminar(req.params.id);

    logAction(
      req.session.user.username,
      'DELETE_STOCK',
      req.params.id,
      'WARN'
    );

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({
      error:'Error eliminando producto'
    });

  }

});


return router;

};