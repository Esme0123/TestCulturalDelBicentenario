// routes/desafioRoutes.js
const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/desafios/crear - Crear un nuevo desafío (retar a alguien)
router.post('/crear', verifyToken, desafioController.crearDesafio);

// GET /api/desafios/pendientes - Obtener los desafíos pendientes para el usuario logueado
router.get('/pendientes', verifyToken, desafioController.getDesafiosPendientes);

// POST /api/desafios/:id_desafio/responder - Aceptar o rechazar un desafío
router.post('/:id_desafio/responder', verifyToken, desafioController.responderDesafio);

// (FALTANTE) Rutas para jugar el desafío, ver resultados de desafíos, etc.

module.exports = router;
