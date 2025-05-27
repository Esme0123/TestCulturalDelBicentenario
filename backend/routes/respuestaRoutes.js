// routes/respuestaRoutes.js
const express = require('express');
const router = express.Router();
const respuestaController = require('../controllers/respuestaController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/respuestas/submit - Enviar las respuestas de un test (protegido)
// Body: { id_test: X, respuestas_usuario: [ { id_pregunta: Y, id_respuesta_seleccionada: Z }, ... ], duracion_segundos: T }
router.post('/submit', verifyToken, respuestaController.submitRespuestasTest);

module.exports = router;
