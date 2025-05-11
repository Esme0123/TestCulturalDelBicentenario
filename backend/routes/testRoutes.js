// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { verifyToken } = require('../middleware/authMiddleware'); // Proteger rutas que requieren login

// POST /api/tests/crear - Crear un nuevo test (protegido)
// El body debe incluir: nombre, id_categoria, id_dificultad, [descripcion], [es_personalizado], [preguntas]
router.post('/crear', verifyToken, testController.crearTest);

// GET /api/tests - Obtener tests disponibles (filtrables por query params ?id_categoria=X&id_dificultad=Y)
// Esta ruta puede ser pública o protegida según se necesite
router.get('/', testController.getTestsDisponibles);

// GET /api/tests/:id_test - Obtener detalles de un test específico
router.get('/:id_test', testController.getTestById);


module.exports = router;
