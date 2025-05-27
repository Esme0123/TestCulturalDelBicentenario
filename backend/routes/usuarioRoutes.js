const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, usuarioController.getUsuarios);

module.exports = router;
