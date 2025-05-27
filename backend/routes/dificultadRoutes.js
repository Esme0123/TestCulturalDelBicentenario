// routes/dificultadRoutes.js
const express = require('express');
const router = express.Router();
const dificultadController = require('../controllers/dificultadController');

// GET /api/dificultades - Obtener todos los niveles de dificultad
router.get('/', dificultadController.getAllDificultades);

// Por si se desea crear dificultad 
// router.post('/', verifyAdmin, dificultadController.createDificultad);
module.exports = router;
