// Este Map seguirá guardando el estado en memoria. Para producción, considera usar Redis.
const desafioRooms = new Map();

// Un Map para rastrear en qué sala está cada socket.id. Facilita la limpieza al desconectar.
const socketToRoomMap = new Map();

function socketController(io) {
    io.on('connection', (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        // --- UNIRSE A UN DESAFÍO ---
        socket.on('joinChallenge', ({ roomId, userId }) => {
            if (!roomId || !userId) {
                return socket.emit('errorMessage', 'Faltan datos para unirse a la sala (roomId, userId).');
            }

            socket.join(roomId);
            socketToRoomMap.set(socket.id, roomId); // Guardamos la relación socket -> room

            // Inicializa la sala si es la primera vez
            if (!desafioRooms.has(roomId)) {
                desafioRooms.set(roomId, {
                    users: new Map(), // Map<userId, {socketId, isOnline}>
                    scores: new Map(), // Map<userId, number>
                });
            }

            const room = desafioRooms.get(roomId);

            // Añade o actualiza al usuario en la sala
            room.users.set(userId, { socketId: socket.id, isOnline: true });
            if (!room.scores.has(userId)) {
                room.scores.set(userId, 0);
            }

            console.log(`Usuario ${userId} (socket ${socket.id}) se unió a la sala ${roomId}`);

            // Notifica a todos en la sala sobre el estado actualizado de los jugadores y puntajes
            io.to(roomId).emit('roomStateUpdate', {
                players: Array.from(room.users.keys()),
                scores: Object.fromEntries(room.scores),
            });

            // Si ya hay dos jugadores, inicia el desafío
            if (room.users.size === 2) {
                console.log(`La sala ${roomId} está llena. ¡Comenzando desafío!`);
                io.to(roomId).emit('startChallenge', { message: 'Ambos jugadores están listos. ¡El desafío comienza!' });
            }
        });

        // --- RECIBIR Y VALIDAR RESPUESTA ---
        socket.on('sendAnswer', async ({ roomId, userId, questionId, answer }) => {
            const room = desafioRooms.get(roomId);
            if (!room || !room.users.has(userId)) {
                return socket.emit('errorMessage', 'No estás en esta sala de desafío.');
            }

            try {
                // Lógica de validación (asumiendo que tu DB está en io.db)
                const [rows] = await io.db.query(
                    'SELECT es_correcta FROM respuestas WHERE id_respuesta = ?',
                    [answer]
                );

                const esCorrecta = rows.length > 0 && rows[0].es_correcta === 1;

                if (esCorrecta) {
                    const currentScore = room.scores.get(userId) || 0;
                    const newScore = currentScore + 10; // O los puntos que quieras dar
                    room.scores.set(userId, newScore);
                }

                // Notifica a TODOS los jugadores sobre la actualización de puntajes
                io.to(roomId).emit('roomStateUpdate', {
                    scores: Object.fromEntries(room.scores),
                });


            } catch (err) {
                console.error('Error validando respuesta:', err);
                socket.emit('errorMessage', 'Error del servidor al validar la respuesta.');
            }
        });


        // --- FINALIZAR DESAFÍO ---
        socket.on('finishChallenge', async ({ roomId, userId }) => {
            const room = desafioRooms.get(roomId);
            if (!room || !room.users.has(userId)) return;

             // Marca al usuario como "finalizado" (lógica opcional pero recomendada)
            const userState = room.users.get(userId);
            if(userState) userState.finished = true;

            // Comprueba si todos los jugadores han finalizado
            const allFinished = [...room.users.values()].every(u => u.finished);

            if (allFinished) {
                 console.log(`Todos en la sala ${roomId} han finalizado. Cerrando desafío.`);
                // Aquí podrías determinar el ganador
                const scores = Array.from(room.scores.entries());
                const winner = scores.reduce((a, b) => a[1] > b[1] ? a : b, [null, -1])[0];

                io.to(roomId).emit('challengeFinished', {
                    scores: Object.fromEntries(room.scores),
                    winnerId: winner,
                });

                // Limpia la sala después de un tiempo para que los jugadores vean los resultados
                setTimeout(() => {
                    desafioRooms.delete(roomId);
                    console.log(`Sala ${roomId} eliminada.`);
                }, 10000); // 10 segundos
            }
        });


        // --- MANEJO DE DESCONEXIÓN ---
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
            const roomId = socketToRoomMap.get(socket.id);

            if (roomId && desafioRooms.has(roomId)) {
                const room = desafioRooms.get(roomId);
                let userIdToRemove = null;

                // Encontrar el userId asociado a este socket.id
                for (const [userId, userData] of room.users.entries()) {
                    if (userData.socketId === socket.id) {
                        userIdToRemove = userId;
                        break;
                    }
                }

                if (userIdToRemove) {
                    room.users.delete(userIdToRemove);
                    socketToRoomMap.delete(socket.id);
                    console.log(`Usuario ${userIdToRemove} eliminado de la sala ${roomId}`);

                    // Notificar al otro jugador que su oponente se fue
                    io.to(roomId).emit('opponentLeft', {
                        message: `¡Tu oponente (usuario ${userIdToRemove}) se ha desconectado!`,
                        userId: userIdToRemove
                    });
                }
                
                // Si la sala queda vacía, eliminarla
                if (room.users.size === 0) {
                    desafioRooms.delete(roomId);
                    console.log(`Sala ${roomId} vacía y eliminada.`);
                }
            }
        });
    });
}

module.exports = socketController;
