const desafioRooms = new Map(); // Map<roomId, { users: Set<userId>, scores: Map<userId, number>, answeredQuestions: Map<userId, Set<questionId>> }>

function socketController(io) {
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Asociar userId a socketId para gestión interna (puedes mejorar con autenticación)
    socket.on('joinChallenge', ({ roomId, userId }) => {
      socket.join(roomId);
      if (!desafioRooms.has(roomId)) {
        desafioRooms.set(roomId, {
          users: new Set(),
          scores: new Map(),
          answeredQuestions: new Map(),
        });
      }
      const room = desafioRooms.get(roomId);
      room.users.add(userId);
      if (!room.scores.has(userId)) room.scores.set(userId, 0);
      if (!room.answeredQuestions.has(userId)) room.answeredQuestions.set(userId, new Set());

      console.log(`Usuario ${userId} se unió a la sala ${roomId}`);

      io.to(roomId).emit('playersUpdate', Array.from(room.users));

      // Opcional: iniciar juego cuando 2 jugadores estén en sala
      if (room.users.size === 2) {
        io.to(roomId).emit('startChallenge', { message: 'El desafío comienza!' });
      }
    });

    // Validar respuesta y actualizar puntaje
    socket.on('sendAnswer', async ({ roomId, userId, questionId, answer }) => {
      const room = desafioRooms.get(roomId);
      if (!room) {
        socket.emit('errorMessage', 'Sala no encontrada.');
        return;
      }

      if (room.answeredQuestions.get(userId).has(questionId)) {
        socket.emit('errorMessage', 'Pregunta ya respondida.');
        return;
      }

      // Guardar que usuario respondió esta pregunta
      room.answeredQuestions.get(userId).add(questionId);

      try {
        const [rows] = await io.db.query(`
          SELECT r.es_correcta 
          FROM preguntas p
          JOIN respuestapreguntas rp ON p.id_pregunta = rp.id_pregunta
          JOIN respuestas r ON rp.id_respuesta = r.id_respuesta
          WHERE p.id_pregunta = ? AND r.id_respuesta = ?
          LIMIT 1;
        `, [questionId, answer]);

        const esCorrecta = rows.length > 0 && rows[0].es_correcta === 1;

        if (esCorrecta) {
          const oldScore = room.scores.get(userId) || 0;
          room.scores.set(userId, oldScore + 10); // Ejemplo: 10 pts por correcta
        }

        // Emitir a oponente resultado parcial
        socket.to(roomId).emit('opponentAnswered', { userId, questionId, answer, esCorrecta });

        // Confirmar al usuario
        socket.emit('answerResult', { questionId, esCorrecta });

      } catch (err) {
        console.error('Error validando respuesta:', err);
        socket.emit('errorMessage', 'Error validando respuesta.');
      }
    });

    socket.on('finishChallenge', async ({ roomId, userId, puntaje }) => {
      try {
        await io.db.query(`
          INSERT INTO desafio_resultados (id_desafio, id_user, puntaje)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE puntaje = VALUES(puntaje);
        `, [roomId, userId, puntaje]);

        const [resultados] = await io.db.query(`
          SELECT COUNT(DISTINCT id_user) AS total_jugadores FROM desafio_resultados WHERE id_desafio = ?;
        `, [roomId]);

        if (resultados[0].total_jugadores >= 2) {
          const ID_ESTADO_FINALIZADO = 5;
          await io.db.query(`UPDATE desafios SET id_estado = ? WHERE id_desafio = ?`, [ID_ESTADO_FINALIZADO, roomId]);
        }

        io.to(roomId).emit('challengeFinished', { userId, puntaje });
      } catch (error) {
        console.error('Error al guardar resultado de desafío:', error);
        socket.emit('errorMessage', 'Error al guardar resultado.');
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
      // Aquí podrías recorrer salas y eliminar usuarios desconectados,
      // emitir actualización a los otros jugadores
      // Esto es más complejo, pero recomendable para robustez
    });
  });
}

module.exports = socketController;
