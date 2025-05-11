// routes/rankingRoutes.js
const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

// GET /api/rankings - Obtener los rankings
// Query params opcionales: ?tipo=semanal|mensual|general&limit=10
router.get('/', rankingController.getRankings);

module.exports = router;
