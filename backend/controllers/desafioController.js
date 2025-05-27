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

// Obtener desafíos pendientes del usuario logueado (donde es retado)
exports.getDesafiosPendientes = async (req, res) => {
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

// (FALTA) Lógica para jugar un desafío aceptado y registrar resultados de ambos jugadores.
// Esto requeriría manejar el estado del desafío ('En Curso', 'Finalizado'),
// almacenar los puntajes de ambos usuarios para ESE desafío específico, y determinar un ganador.
// Es significativamente más complejo y probablemente necesite WebSockets para una experiencia en tiempo real.
// Registrar resultado y finalizar desafío si ambos jugadores terminaron
exports.finalizarDesafio = async (req, res) => {
  const id_user = req.userId;
  const { id_desafio, puntaje } = req.body;

  if (!id_desafio || puntaje === undefined) {
    return res.status(400).json({ message: 'Faltan datos para finalizar desafío.' });
  }

  try {
    // Guardar o actualizar el puntaje del usuario para el desafío
    await db.query(`
      INSERT INTO desafio_resultados (id_desafio, id_user, puntaje)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE puntaje = VALUES(puntaje);
    `, [id_desafio, id_user, puntaje]);

    // Verificar cuántos jugadores ya entregaron resultados
    const [resultados] = await db.query(`
      SELECT COUNT(DISTINCT id_user) AS total_jugadores FROM desafio_resultados WHERE id_desafio = ?;
    `, [id_desafio]);

    // Suponiendo que un desafío es entre 2 jugadores
    if (resultados[0].total_jugadores >= 2) {
      // Actualizar estado a Finalizado (supongamos ID 5)
      const ID_ESTADO_FINALIZADO = 5;
      await db.query(`UPDATE desafios SET id_estado = ? WHERE id_desafio = ?`, [ID_ESTADO_FINALIZADO, id_desafio]);
    }

    res.json({ message: 'Resultado guardado exitosamente.' });

  } catch (error) {
    console.error('Error al finalizar desafío:', error);
    res.status(500).json({ message: 'Error interno al finalizar desafío.' });
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
