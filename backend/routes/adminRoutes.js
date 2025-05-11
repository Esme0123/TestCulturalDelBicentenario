// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController'); 
const { verifyAdmin } = require('../middleware/authMiddleware'); // Middleware específico para admin

// --- Gestión de Preguntas ---
// GET /api/admin/preguntas - Obtener todas las preguntas para la vista admin
router.get('/preguntas', verifyAdmin, preguntaController.getAllPreguntasAdmin);

// POST /api/admin/preguntas - Crear una nueva pregunta
router.post('/preguntas', verifyAdmin, preguntaController.createPregunta);

// PUT /api/admin/preguntas/:id_pregunta - Actualizar una pregunta
router.put('/preguntas/:id_pregunta', verifyAdmin, preguntaController.updatePregunta);

// DELETE /api/admin/preguntas/:id_pregunta - Eliminar una pregunta
router.delete('/preguntas/:id_pregunta', verifyAdmin, preguntaController.deletePregunta);

// GET /api/admin/pregunta-tipos - Obtener tipos de pregunta (útil para el form de admin)
router.get('/pregunta-tipos', verifyAdmin, preguntaController.getTiposPregunta);


// --- Otras posibles rutas de admin ---
// GET /api/admin/usuarios - Obtener lista de usuarios
// PUT /api/admin/usuarios/:id_user - Modificar rol de usuario
// etc.

module.exports = router;
