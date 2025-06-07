// controllers/desafioController.js
const db = require('../config/db');

// Crear un nuevo desafío (retar a otro usuario)
exports.crearDesafio = async (req, res) => {
  const id_usuario_creador = req.userId;
  const { id_usuario_retado, id_test_base } = req.body;

  if (!id_usuario_retado || !id_test_base) {
    return res.status(400).json({ message: 'Se requiere usuario retado y test base.' });
  }
  if (id_usuario_creador === parseInt(id_usuario_retado, 10)) {
    return res.status(400).json({ message: 'No puedes retarte a ti mismo.' });
  }

  try {
    // Obtener info del test (categoría, dificultad)
    const [testInfo] = await db.query('SELECT id_categoria, id_dificultad FROM tests WHERE id_test = ?', [id_test_base]);
    if (testInfo.length === 0) {
      return res.status(404).json({ message: 'Test base no encontrado.' });
    }
    const { id_categoria, id_dificultad } = testInfo[0];

    // Verificar que el usuario retado exista
    const [userRetado] = await db.query('SELECT id_user FROM usuarios WHERE id_user = ?', [id_usuario_retado]);
    if (userRetado.length === 0) {
      return res.status(404).json({ message: 'Usuario retado no encontrado.' });
    }

    const ID_ESTADO_PENDIENTE = 1;
    const fecha_inicio = new Date();

    // Crear desafío
    const sqlInsert = `
      INSERT INTO desafios (id_test_base, id_categoria, id_dificultad, id_usuario_creador, id_usuario_retado, id_estado, fecha_inicio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sqlInsert, [
      id_test_base,
      id_categoria,
      id_dificultad,
      id_usuario_creador,
      id_usuario_retado,
      ID_ESTADO_PENDIENTE,
      fecha_inicio
    ]);
    const id_desafio = result.insertId;

    // Copiar preguntas del test base al desafío
    const [preguntas] = await db.query(
      'SELECT id_pregunta FROM test_pregunta WHERE id_test = ?',
      [id_test_base]
    );

    if (preguntas.length > 0) {
      const values = preguntas.map(p => [id_desafio, p.id_pregunta]);
      await db.query(
        'INSERT INTO desafio_preguntas (id_desafio, id_pregunta) VALUES ?',
        [values]
      );
    }

    res.status(201).json({ message: 'Desafío creado con éxito.', id_desafio });

  } catch (error) {
    console.error("Error al crear desafío:", error);
    res.status(500).json({ message: 'Error interno al crear el desafío.' });
  }
};

// Obtener desafíos recibidos del usuario logueado (donde es retado)
exports.getDesafiosRecibidos = async (req, res) => {
    const id_user = req.userId;
    console.log('[DEBUG] Usuario que solicita desafíos pendientes:', id_user);
    const ID_ESTADO_PENDIENTE = 1; 
    try {
        const sql = `
            SELECT
                d.id_desafio,
                d.fecha_inicio,
                t.nombre AS test_nombre,
                c.nombre AS categoria_nombre,
                nd.dificultad AS dificultad_nombre,
                u_creador.nombre AS creador_nombre,
                d.id_estado AS estado
            FROM desafios d
            JOIN tests t ON d.id_test_base = t.id_test
            JOIN categorias c ON d.id_categoria = c.id_categoria
            JOIN niveldificultad nd ON d.id_dificultad = nd.id_dificultad
            JOIN usuarios u_creador ON d.id_usuario_creador = u_creador.id_user
            WHERE d.id_usuario_retado = ? AND d.id_estado = ?
            ORDER BY d.fecha_inicio DESC;
        `;
        const [desafios] = await db.query(sql, [id_user, ID_ESTADO_PENDIENTE]);
        console.log('[DEBUG] Desafíos pendientes encontrados:', desafios.length);
        res.json(desafios);
    } catch (error) {
        console.error("Error al obtener desafíos pendientes:", error);
        res.status(500).json({ message: 'Error interno al obtener desafíos.' });
    }
};
exports.getDesafiosEnviados = async (req, res) => {
    const id_user = req.userId;
    try {
        const sql = `
            SELECT d.id_desafio, d.fecha_inicio, u_retado.nombre AS retado_nombre, t.nombre AS test_nombre, e.nombre_estado
            FROM desafios d
            JOIN usuarios u_retado ON d.id_usuario_retado = u_retado.id_user
            JOIN tests t ON d.id_test_base = t.id_test
            JOIN estados e ON d.id_estado = e.id_estado
            WHERE d.id_usuario_creador = ?
            ORDER BY d.fecha_inicio DESC;
        `;
        const [desafios] = await db.query(sql, [id_user]);
        res.json(desafios);
    } catch (error) {
        console.error("Error al obtener desafíos enviados:", error);
        res.status(500).json({ message: 'Error interno al obtener desafíos.' });
    }
};
exports.aceptarDesafio = async (req, res) => {
    const id_user = req.userId; // El usuario que está aceptando (retado)
    const { id_desafio } = req.params;
    const ID_ESTADO_EN_PROGRESO = 2; // O "Aceptado"
    const ID_ESTADO_PENDIENTE = 1;

    try {
        const [result] = await db.query(
            `UPDATE desafios SET id_estado = ? WHERE id_desafio = ? AND id_usuario_retado = ? AND id_estado = ?`,
            [ID_ESTADO_EN_PROGRESO, id_desafio, id_user, ID_ESTADO_PENDIENTE]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Desafío no encontrado o ya respondido.' });
        }

        // --- NOTIFICACIÓN EN TIEMPO REAL ---
        const [desafioInfo] = await db.query(
            'SELECT id_usuario_creador FROM desafios WHERE id_desafio = ?',
            [id_desafio]
        );
        if (desafioInfo.length === 0) {
            // Este caso es improbable si la actualización anterior fue exitosa, pero es una buena práctica de seguridad.
            console.error(`CRITICAL: Desafío ${id_desafio} aceptado pero no se pudo encontrar para notificar.`);
            return res.json({ message: 'Desafío aceptado, pero hubo un problema al notificar.' });
        }
        const id_creador = desafioInfo[0].id_usuario_creador;
        const io = req.app.get('io');

        io.emit('desafio_actualizado', { 
            id_desafio, 
            nuevo_estado: 'EN PROGRESO',
            id_creador: id_creador
        });
        
        res.json({ message: `Desafío aceptado con éxito.` });
    } catch (error) {
        console.error("Error al aceptar desafío:", error);
        res.status(500).json({ message: 'Error interno al aceptar el desafío.' });
    }
};

exports.rechazarDesafio = async (req, res) => {
    const id_user = req.userId;
    const { id_desafio } = req.params;
    const ID_ESTADO_RECHAZADO = 3;
    const ID_ESTADO_PENDIENTE = 1;

    try {
        const [result] = await db.query(
            `UPDATE desafios SET id_estado = ? WHERE id_desafio = ? AND id_usuario_retado = ? AND id_estado = ?`,
            [ID_ESTADO_RECHAZADO, id_desafio, id_user, ID_ESTADO_PENDIENTE]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Desafío no encontrado o ya respondido.' });
        }
        
        // También notificamos el rechazo
        const io = req.app.get('io');
        io.emit('desafio_actualizado', { id_desafio, nuevo_estado: 'RECHAZADO' });
        
        res.json({ message: `Desafío rechazado con éxito.` });
    } catch (error) {
        console.error("Error al rechazar desafío:", error);
        res.status(500).json({ message: 'Error interno al rechazar el desafío.' });
    }
};

// Aceptar o Rechazar un desafío (Actualizar estado)
exports.responderDesafio = async (req, res) => {
    const id_user = req.userId; // El usuario retado
    const { id_desafio } = req.params;
    const { aceptar } = req.body; // true para aceptar, false para rechazar

    const ID_ESTADO_ACEPTADO = 2; 
    const ID_ESTADO_RECHAZADO = 3;
    const ID_ESTADO_PENDIENTE = 1;

    const nuevo_estado = aceptar ? ID_ESTADO_ACEPTADO : ID_ESTADO_RECHAZADO;

    try {
        // Verificar que el desafío existe, pertenece al usuario y está pendiente
        const sqlUpdate = `
            UPDATE desafios
            SET id_estado = ?, fecha_fin = IF(? = ?, NOW(), fecha_fin)
            WHERE id_desafio = ? AND id_usuario_retado = ? AND id_estado = ?;
        `;
        const [result] = await db.query(sqlUpdate, [nuevo_estado, nuevo_estado, ID_ESTADO_RECHAZADO, id_desafio, id_user, ID_ESTADO_PENDIENTE]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Desafío no encontrado, no pertenece al usuario o ya fue respondido.' });
        }

        // Lógica de notificación al creador...
         // --- NUEVO: Emitir evento Socket.IO para iniciar desafío ---
        if (aceptar) {
            // Obtener instancia de io
            const io = req.app.get('io');

            // Obtener usuarios del desafío
            const [desafioInfo] = await db.query(`
                SELECT id_usuario_creador, id_usuario_retado
                FROM desafios
                WHERE id_desafio = ?;
            `, [id_desafio]);

            if (desafioInfo.length > 0) {
                const { id_usuario_creador, id_usuario_retado } = desafioInfo[0];

                // Emitir evento a los dos usuarios para que inicien el juego
                // La forma más robusta es que el frontend conecte con socket a una sala llamada id_desafio
                io.to(id_desafio.toString()).emit('challengeAccepted', {
                    id_desafio,
                    message: 'El desafío ha sido aceptado. ¡Comiencen a jugar!',
                });
            }
        }
        res.json({ message: `Desafío ${aceptar ? 'aceptado' : 'rechazado'} con éxito.` });

    } catch (error) {
        console.error("Error al responder desafío:", error);
        res.status(500).json({ message: 'Error interno al responder al desafío.' });
    }
};


exports.finalizarDesafio = async (req, res) => {
  const id_user = req.userId;
  const { id_desafio, puntaje , respuestas} = req.body;

  if (!id_desafio || puntaje === undefined || !respuestas) {
    return res.status(400).json({ message: 'Faltan datos para finalizar desafío.' });
  }
  let connection;
  try {
    connection = await db.getConnection();
    await connection.query(`
            INSERT INTO desafio_resultados (id_desafio, id_user, puntaje)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE puntaje = VALUES(puntaje);
        `, [id_desafio, id_user, puntaje]);

    // 2. Obtener datos necesarios para la tabla historial_tests
    const [desafioInfo] = await connection.query(
            'SELECT id_test_base, fecha_inicio FROM desafios WHERE id_desafio = ?',
            [id_desafio]
        );

    if (desafioInfo.length === 0) {
      return res.status(404).json({ message: 'Información del desafío no encontrada para el historial.' });
    }
    const { id_test_base, fecha_inicio } = desafioInfo[0];
    const duracion_segundos = Math.round((new Date() - new Date(fecha_inicio)) / 1000);
    
    // Obtener el total de preguntas para calcular el puntaje máximo (total)
    const [preguntasData] = await connection.query(
            'SELECT COUNT(id_pregunta) as total_preguntas FROM desafio_preguntas WHERE id_desafio = ?',
            [id_desafio]
        );
    const total_preguntas = preguntasData.length > 0 ? preguntasData[0].total_preguntas : 0;
    const puntaje_maximo = total_preguntas * 10; 

    // 3. Insertar el registro en la tabla historial_tests para este usuario
    const [historialResult] = await connection.query(
            `INSERT INTO historial_tests (id_user, id_test, fecha, puntaje, total, duracion_segundos)
             VALUES (?, ?, NOW(), ?, ?, ?);`,
            [id_user, id_test_base, puntaje, puntaje_maximo, duracion_segundos]
        );
    const id_historial = historialResult.insertId;
    //4.resultado_pregunta
    if (respuestas && respuestas.length > 0) {
            for (const respuesta of respuestas) {
                // Verificamos si la respuesta dada es correcta
                const [infoRespuesta] = await connection.query(
                    'SELECT es_correcta FROM respuestas WHERE id_respuesta = ?',
                    [respuesta.id_respuesta]
                );
                const es_correcta = (infoRespuesta.length > 0 && infoRespuesta[0].es_correcta === 1) ? 1 : 0;
                
                // Insertamos el detalle para la página de revisión
                await connection.query(
                    `INSERT INTO resultado_pregunta (id_historial, id_pregunta, id_respuesta, es_correcta)
                     VALUES (?, ?, ?, ?);`,
                    [id_historial, respuesta.id_pregunta, respuesta.id_respuesta, es_correcta]
                );
            }
        }
    // 5. Verificar si ambos jugadores han terminado para actualizar el estado general del desafío
    const [resultados] = await connection.query(
            'SELECT COUNT(DISTINCT id_user) AS total_jugadores FROM desafio_resultados WHERE id_desafio = ?',
            [id_desafio]
    );

    if (resultados[0].total_jugadores >= 2) {
      const ID_ESTADO_FINALIZADO = 5; // ID para el estado "Finalizado" en tu DB
      await db.query(
        'UPDATE desafios SET id_estado = ?, fecha_fin = NOW() WHERE id_desafio = ?',
        [ID_ESTADO_FINALIZADO, id_desafio]
      );
    }

    res.json({ message: 'Resultado y historial guardados exitosamente.' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error al finalizar desafío:', error);
    res.status(500).json({ message: 'Error interno al finalizar desafío.' });
  }finally {
    if (connection) connection.release();
  }
};
// Obtener preguntas y respuestas del desafío para frontend
exports.getPreguntasDelDesafio = async (req, res) => {
  const { roomId } = req.params;
  try {
    const sql = `
      SELECT
        p.id_pregunta,
        p.textoPregunta,
        r.id_respuesta,
        r.texto AS textoRespuesta
      FROM desafio_preguntas dp
      JOIN preguntas p ON dp.id_pregunta = p.id_pregunta
      JOIN respuestapreguntas rp ON p.id_pregunta = rp.id_pregunta
      JOIN respuestas r ON rp.id_respuesta = r.id_respuesta
      WHERE dp.id_desafio = ?
      ORDER BY p.id_pregunta, r.id_respuesta;
    `;
    const [results] = await db.query(sql, [roomId]);

    // Agrupar preguntas y sus respuestas
    const preguntasMap = new Map();
    results.forEach(row => {
      if (!preguntasMap.has(row.id_pregunta)) {
        preguntasMap.set(row.id_pregunta, {
          id_pregunta: row.id_pregunta,
          textoPregunta: row.textoPregunta,
          respuestas: [],
        });
      }
      preguntasMap.get(row.id_pregunta).respuestas.push({
        id_respuesta: row.id_respuesta,
        texto: row.textoRespuesta,
      });
    });

    res.json(Array.from(preguntasMap.values()));
  } catch (error) {
    console.error('Error al obtener preguntas del desafío:', error);
    res.status(500).json({ message: 'Error interno al obtener preguntas del desafío.' });
  }
};

// Obtener resultados finales de un desafío
exports.getResultadosDesafio = async (req, res) => {
  const { id_desafio } = req.params;
  try {
    const sql = `
      SELECT
        dr.id_user,
        u.nombre AS nombre_usuario,
        dr.puntaje,
        dr.fecha
      FROM desafio_resultados dr
      JOIN usuarios u ON dr.id_user = u.id_user
      WHERE dr.id_desafio = ?
      ORDER BY dr.puntaje DESC;
    `;
    const [resultados] = await db.query(sql, [id_desafio]);
    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener resultados del desafío:', error);
    res.status(500).json({ message: 'Error interno al obtener resultados del desafío.' });
  }
};
exports.getDesafiosCreados = async (req, res) => {
  const id_user = req.userId;
  try {
    const sql = `
      SELECT
        d.id_desafio,
        d.fecha_inicio,
        u_retado.nombre AS retado_nombre,
        t.nombre AS test_nombre,
        e.nombre_estado
      FROM desafios d
      JOIN usuarios u_retado ON d.id_usuario_retado = u_retado.id_user
      JOIN tests t ON d.id_test_base = t.id_test
      JOIN estados e ON d.id_estado = e.id_estado
      WHERE d.id_usuario_creador = ?
      ORDER BY d.fecha_inicio DESC;
    `;
    const [desafios] = await db.query(sql, [id_user]);
    res.json(desafios);
  } catch (error) {
    console.error("Error al obtener desafíos creados:", error);
    res.status(500).json({ message: 'Error interno al obtener desafíos creados.' });
  }
};
