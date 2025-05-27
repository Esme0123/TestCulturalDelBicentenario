    // routes/adminRoutes.js
    const express = require('express');
    const router = express.Router();
    const preguntaController = require('../controllers/preguntaController');
    const adminTestController = require('../controllers/adminTestController'); // Asumiendo que lo crearemos o ya existe
    const adminUserController = require('../controllers/adminUserController'); // Nuevo controlador
    const { verifyAdmin } = require('../middleware/authMiddleware');

    // --- Gestión de Preguntas ---
    router.get('/preguntas', verifyAdmin, preguntaController.getAllPreguntasAdmin);
    router.post('/preguntas', verifyAdmin, preguntaController.createPregunta);
    router.put('/preguntas/:id_pregunta', verifyAdmin, preguntaController.updatePregunta);
    router.delete('/preguntas/:id_pregunta', verifyAdmin, preguntaController.deletePregunta);
    router.get('/pregunta-tipos', verifyAdmin, preguntaController.getTiposPregunta); // Útil para el form

    // --- Gestión de Tests Base (por Admin) ---
    
    router.get('/tests', verifyAdmin, adminTestController.getAllTestsAdmin); 
    router.post('/tests', verifyAdmin, adminTestController.createTestAdmin); 
    router.get('/tests/:id_test', verifyAdmin, adminTestController.getTestByIdAdmin); 
    router.put('/tests/:id_test', verifyAdmin, adminTestController.updateTestAdmin); 
    router.delete('/tests/:id_test', verifyAdmin, adminTestController.deleteTestAdmin); 

    // --- Gestión de Usuarios (por Admin) ---
    router.get('/usuarios', verifyAdmin, adminUserController.getAllUsersAdmin);
    router.get('/usuarios/:id_user', verifyAdmin, adminUserController.getUserByIdAdmin); // Para obtener datos antes de editar
    router.put('/usuarios/:id_user', verifyAdmin, adminUserController.updateUserAdmin);
    router.delete('/usuarios/:id_user', verifyAdmin, adminUserController.deleteUserAdmin);

    // --- (Opcional) Gestión de Categorías y Dificultades si son administrables ---
    // router.get('/categorias', verifyAdmin, categoriaController.getAllCategorias);
    // router.post('/categorias', verifyAdmin, categoriaController.createCategoria);
    // ... y así para PUT, DELETE

    module.exports = router;


