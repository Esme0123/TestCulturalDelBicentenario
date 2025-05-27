// routes/preguntaRoutes.js
const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// --- Rutas para Usuarios ---
// GET /api/preguntas/test/:id_test - Obtener las preguntas para un test específico (protegido)
router.get('/test/:id_test', verifyToken, preguntaController.getPreguntasParaTest);

// GET /api/preguntas/tipos - Obtener los tipos de pregunta disponibles (puede ser pública o protegida)
router.get('/tipos', preguntaController.getTiposPregunta);

// --- Rutas para Administradores ---
// GET /api/preguntas/admin/all - Obtener todas las preguntas con detalles para admin (protegido por admin)
router.get('/admin/all', verifyAdmin, preguntaController.getAllPreguntasAdmin);

// POST /api/preguntas/admin - Crear una nueva pregunta (protegido por admin)
router.post('/admin', verifyAdmin, preguntaController.createPregunta);

// PUT /api/preguntas/admin/:id_pregunta - Actualizar una pregunta (protegido por admin)
router.put('/admin/:id_pregunta', verifyAdmin, preguntaController.updatePregunta);

// DELETE /api/preguntas/admin/:id_pregunta - Eliminar una pregunta (protegido por admin)
router.delete('/admin/:id_pregunta', verifyAdmin, preguntaController.deletePregunta);


module.exports = router;

