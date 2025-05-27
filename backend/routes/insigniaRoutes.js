// routes/insigniaRoutes.js
const express = require('express');
const router = express.Router();
const insigniaController = require('../controllers/insigniaController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/insignias - Obtener todas las insignias disponibles (pública o protegida)
router.get('/', insigniaController.getAllInsignias);

// GET /api/insignias/mis-insignias - Obtener las insignias del usuario logueado (protegida)
router.get('/mis-insignias', verifyToken, insigniaController.getMisInsignias);

module.exports = router;
