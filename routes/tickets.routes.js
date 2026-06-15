const express = require('express');

const ticketsService = require('../services/tickets.service');

function onlyAdmin(req,res,next){

  if(!req.session.user || req.session.user.role !== 'admin'){
    return res.status(403).json({ error:'forbidden' });
  }

  next();
}

module.exports = (db, auth, logAction) => {

  const router = express.Router();

  const service = ticketsService(db);

  // =========================
  // CREAR TICKET
  // =========================
  router.post('/', auth, async (req, res) => {

    console.log("BODY RECIBIDO:", req.body);

    try {

      const ticketData = req.body;

      if (
        !ticketData ||
        !ticketData.titulo ||
        !ticketData.cliente ||
        !ticketData.tipo
      ) {
        return res.status(400).json({
          success: false,
          error: 'FALTAN DATOS'
        });
      }

      const result = await service.crearTicket(ticketData);

      logAction(
  req.session.user.username,
  'CREATE_TICKET',
  result.id
);

      res.json(result);

    } catch (err) {

      console.log("ERROR LISTAR TICKETS:", err);

      res.status(500).json({
        success: false,
        error: 'Error creando ticket'
      });

    }

  });

  // =========================
  // LISTAR TICKETS
  // =========================
  router.get('/', auth, async (req, res) => {

    try {

      const page = parseInt(req.query.page) || 1;

      const tipo = req.query.tipo || 'diario';

      const result = await service.listarTickets(tipo, page);

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error listando tickets'
      });

    }

  });

  // =========================
  // BUSCADOR
  // =========================
  router.get('/search', auth, async (req, res) => {

    try {

      const q = req.query.q;

      if (!q) {
        return res.json({
          success: true,
          data: []
        });
      }

      const result = await service.buscarTickets(q);

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error en búsqueda'
      });

    }

  });

  // =========================
  // HISTORIAL
  // =========================
  router.get('/historial', auth, async (req, res) => {

    try {

      const result = await service.historialTickets();

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error historial'
      });

    }

  });

  // =========================
  // ELIMINAR
  // =========================
  router.put('/delete/:id', auth, onlyAdmin, async (req, res) => {
    try {

      const result = await service.eliminarTicket(req.params.id);

      logAction(
        req.session.user.username,
        'DELETE_TICKET',
        req.params.id,
        'WARN'
      );

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error eliminando'
      });

    }

  });

  // =========================
  // RESTAURAR
  // =========================
  router.put('/restore/:id', auth, onlyAdmin, async (req, res) => {

    try {

      const result = await service.restaurarTicket(req.params.id);

      logAction(
        req.session.user.username,
        'RESTORE_TICKET',
        req.params.id
      );

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error restaurando'
      });

    }

  });

  // =========================
  // EDITAR
  // =========================
  router.put('/:id', auth, onlyAdmin, async (req, res) => {

    try {

      const ticketData = req.body;

      const result = await service.editarTicket(
        req.params.id,
        ticketData
      );

      logAction(
        req.session.user.username,
        'EDIT_TICKET',
        req.params.id
      );

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error editando'
      });

    }

  });

  // =========================
  // OBTENER 1 TICKET
  // =========================
  router.get('/:id', auth, async (req, res) => {

    try {

      const result = await service.obtenerTicket(req.params.id);

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        error: 'Error obteniendo ticket'
      });

    }

  });

  return router;

};