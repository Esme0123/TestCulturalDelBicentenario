// routes/testPreguntaRoutes.js
const express = require('express');
const router = express.Router();
const testPreguntaController = require('../controllers/testPreguntaController')
const { verifyToken } = require('../middleware/authMiddleware');

// La ruta que usas en tu frontend es /api/test-pregunta/asociar
router.post('/asociar', verifyToken, testPreguntaController.asociarPreguntasAlTest);

module.exports = router;

