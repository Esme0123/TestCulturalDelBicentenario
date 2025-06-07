// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController');
const adminTestController = require('../controllers/adminTestController');
const adminUserController = require('../controllers/adminUserController');
const adminDashboardController = require('../controllers/adminDashboardController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// --- Dashboard Stats ---
router.get('/stats', verifyAdmin, adminDashboardController.getDashboardStats); 

// --- Gestión de Preguntas ---
router.get('/preguntas', verifyAdmin, preguntaController.getAllPreguntasAdmin);
router.post('/preguntas', verifyAdmin, preguntaController.createPregunta);
router.put('/preguntas/:id_pregunta', verifyAdmin, preguntaController.updatePregunta);
router.delete('/preguntas/:id_pregunta', verifyAdmin, preguntaController.deletePregunta);
router.get('/pregunta-tipos', verifyAdmin, preguntaController.getTiposPregunta);

// --- Gestión de Tests Base (por Admin) ---
router.get('/tests', verifyAdmin, adminTestController.getAllTestsAdmin); 
router.post('/tests', verifyAdmin, adminTestController.createTestAdmin); 
router.get('/tests/:id_test', verifyAdmin, adminTestController.getTestByIdAdmin); 
router.put('/tests/:id_test', verifyAdmin, adminTestController.updateTestAdmin); 
router.delete('/tests/:id_test', verifyAdmin, adminTestController.deleteTestAdmin); 

// --- Gestión de Usuarios (por Admin) ---
router.get('/usuarios', verifyAdmin, adminUserController.getAllUsersAdmin);
router.get('/usuarios/:id_user', verifyAdmin, adminUserController.getUserByIdAdmin);
router.put('/usuarios/:id_user', verifyAdmin, adminUserController.updateUserAdmin);
router.delete('/usuarios/:id_user', verifyAdmin, adminUserController.deleteUserAdmin);

module.exports = router;
