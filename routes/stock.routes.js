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


return router;

};