// routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken } = require('../middleware/authMiddleware'); 

// GET /api/categorias - Obtener todas las categorías (ruta pública o protegida según necesidad)
router.get('/', categoriaController.getAllCategorias);

//Para añadir rutas para crear/editar/eliminar categorías si fueran administrables
//router.post('/crear', verifyAdmin, categoriaController.createCategoria); // Ejemplo protegido para admin

module.exports = router;
