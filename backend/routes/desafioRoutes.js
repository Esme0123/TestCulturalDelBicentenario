const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const usuarioController = require('../controllers/usuarioController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/finalizar', verifyToken, desafioController.finalizarDesafio);
router.post('/crear', verifyToken, desafioController.crearDesafio);
router.get('/pendientes', verifyToken, desafioController.getDesafiosPendientes);
router.post('/:id_desafio/responder', verifyToken, desafioController.responderDesafio);
router.get('/creados', verifyToken, desafioController.getDesafiosCreados);  // Nueva ruta
router.get('/usuarios', verifyToken, usuarioController.getUsuarios);       // Nueva ruta

// (FALTANTE) Rutas para jugar el desafío, ver resultados de desafíos, etc.
router.get('/:roomId/preguntas', verifyToken, desafioController.getPreguntasDelDesafio);
router.get('/:id_desafio/resultados', verifyToken, desafioController.getResultadosDesafio);

module.exports = router;
