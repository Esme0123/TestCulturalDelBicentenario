// controllers/historialController.js
const db = require('../config/db');

// Obtener el historial de tests de un usuario específico (el logueado)
exports.getHistorialUsuario = async(req, res) => {
    const id_user = req.userId; // Obtenido del token
    const sql = `
        SELECT
            ht.id_historial,
            ht.fecha,
            ht.puntaje,
            ht.total,
            ht.duracion_segundos,
            t.nombre AS test_nombre,
            t.id_test,
            c.nombre AS categoria_nombre,
            nd.dificultad AS dificultad_nombre
        FROM historial_tests ht
        JOIN tests t ON ht.id_test = t.id_test
        JOIN categorias c ON t.id_categoria = c.id_categoria
        JOIN niveldificultad nd ON t.id_dificultad = nd.id_dificultad
        WHERE ht.id_user = ?
        ORDER BY ht.fecha DESC; -- Mostrar los más recientes primero
    `;

    try {
        const [rows] = await db.query(sql, [id_user]);
        return res.json(rows);                 // si no hay filas, enviamos []
    } catch (err) {
        console.error('Error al obtener historial del usuario:', err);
        return res.status(500).json({ message: 'Error interno al obtener el historial.' });
    }
};

// Obtener los detalles de un resultado de test específico (para la revisión)
exports.getDetalleResultadoTest = async(req, res) => {
    const id_user = req.userId; 
    const { id_historial } = req.params;

    if (!id_historial) {
        return res.status(400).json({ message: 'Se requiere el ID del historial.' });
    }

    // Consulta para obtener las preguntas, la respuesta del usuario, si fue correcta y la explicación
    const sql = `
        SELECT
            rp.id_pregunta,
            p.textoPregunta,
            tp.tipo AS tipoPregunta,
            rp.id_respuesta,                                -- ID de la respuesta que eligió el usuario
            r_user.texto AS texto_respuesta_seleccionada,        -- Texto de la respuesta elegida
            rp.texto_respuesta_abierta,                     -- Texto si fue abierta
            rp.es_correcta,
            rp.explicacion,
            -- Obtener la(s) respuesta(s) correcta(s) para mostrarlas
            (SELECT GROUP_CONCAT(r.texto SEPARATOR ' | ')
            FROM respuestapreguntas rp_correct
            JOIN respuestas r ON rp_correct.id_respuesta = r.id_respuesta
            WHERE rp_correct.id_pregunta = rp.id_pregunta AND r.es_correcta = 1
            ) AS texto_respuestas_correctas,
            -- Obtener lecturas/videos asociados
             GROUP_CONCAT(DISTINCT CONCAT(lv.titulo, ' (', lv.tipo, '): ', lv.url) SEPARATOR '; ') AS lecturas_videos_asociados
        FROM resultado_pregunta rp
        JOIN preguntas p ON rp.id_pregunta = p.id_pregunta
        JOIN tipopregunta tp ON p.id_tipo = tp.id_tipo
        LEFT JOIN respuestas r_user ON rp.id_respuesta = r_user.id_respuesta        -- Respuesta que dio el usuario
        LEFT JOIN lecturas_videos lv ON p.id_pregunta = lv.id_pregunta
        JOIN historial_tests ht ON rp.id_historial = ht.id_historial                -- Para verificar el usuario
        WHERE rp.id_historial = ? AND ht.id_user = ?
        GROUP BY rp.id_resultado_pregunta                                           -- Agrupa por la fila única de resultado_pregunta
        ORDER BY p.id_pregunta;
    `;

    try {
        const [rows] = await db.query(sql, [id_historial, id_user]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Resultado no encontrado o no pertenece al usuario.' });
        }
        return res.json(rows);
    } catch (err) {
        console.error('Error al obtener detalle del resultado:', err);
        return res.status(500).json({ message: 'Error interno al obtener los detalles del resultado.' });
    }
};


// Obtener estadísticas del usuario por categoría
exports.getEstadisticasUsuario = async(req, res) => {
    const id_user = req.userId;

    const sql = `
        SELECT
            eu.id_categoria,
            c.nombre AS categoria_nombre,
            eu.preguntas_totales,
            eu.respuestas_correctas,
            -- Calcular porcentaje de aciertos
            (eu.respuestas_correctas / eu.preguntas_totales) * 100 AS porcentaje_aciertos
        FROM estadisticas_usuario eu
        JOIN categorias c ON eu.id_categoria = c.id_categoria
        WHERE eu.id_user = ? AND eu.preguntas_totales > 0           -- Evitar división por cero
        ORDER BY c.nombre;
    `;
    try {
        const [rows] = await db.query(sql, [id_user]);
        return res.json(rows);
    } catch (err) {
        console.error('Error al obtener estadísticas del usuario:', err);
        return res.status(500).json({ message: 'Error interno al obtener las estadísticas.' });
    }
};
