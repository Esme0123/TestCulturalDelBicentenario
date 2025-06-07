const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const usuarioController = require('../controllers/usuarioController');
const { verifyToken } = require('../middleware/authMiddleware');

// --- RUTAS DE DESAFÍOS ---

// Obtener los desafíos que el usuario ha recibido (antes /pendientes)
router.get('/recibidos', verifyToken, desafioController.getDesafiosRecibidos);

// Obtener los desafíos que el usuario ha enviado (antes /creados)
router.get('/enviados', verifyToken, desafioController.getDesafiosEnviados);

// Aceptar un desafío. Usamos PUT porque actualiza el estado del desafío.
router.put('/:id_desafio/aceptar', verifyToken, desafioController.aceptarDesafio);

// Rechazar un desafío.
router.put('/:id_desafio/rechazar', verifyToken, desafioController.rechazarDesafio);
// Obtener las preguntas de una sala/desafío específico
router.get('/:roomId/preguntas', verifyToken, desafioController.getPreguntasDelDesafio);

// Obtener los resultados finales de un desafío
router.get('/:id_desafio/resultados', verifyToken, desafioController.getResultadosDesafio);

router.post('/finalizar', verifyToken, desafioController.finalizarDesafio);

router.post('/:id_desafio/responder', verifyToken, desafioController.responderDesafio);
router.get('/creados', verifyToken, desafioController.getDesafiosCreados);  
router.get('/usuarios', verifyToken, usuarioController.getUsuarios);       
router.post('/', verifyToken, desafioController.crearDesafio);
module.exports = router;
