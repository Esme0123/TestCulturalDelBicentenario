// routes/historialRoutes.js
const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const { verifyToken } = require('../middleware/authMiddleware'); // Proteger rutas

// GET /api/historial - Obtener el historial de tests del usuario logueado
router.get('/', verifyToken, historialController.getHistorialUsuario);

// GET /api/historial/detalle/:id_historial - Obtener el detalle de un resultado específico para revisión
router.get('/detalle/:id_historial', verifyToken, historialController.getDetalleResultadoTest);

// GET /api/historial/estadisticas - Obtener las estadísticas por categoría del usuario logueado
router.get('/estadisticas', verifyToken, historialController.getEstadisticasUsuario);


module.exports = router;
