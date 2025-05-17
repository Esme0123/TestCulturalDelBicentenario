// controllers/preguntaController.js
const db = require('../config/db'); 

// --- Funciones para Usuarios ---

// Obtener preguntas para un test específico (con sus posibles respuestas)
exports.getPreguntasParaTest = async (req, res) => {
    const { id_test } = req.params;

    if (!id_test) {
        return res.status(400).json({ message: 'Se requiere el ID del test.' });
    }

    // Consulta para obtener las preguntas asociadas al test y sus respuestas
    // NO SE ENVÍA 'es_correcta' al frontend durante el test
    const sql = `
        SELECT
            p.id_pregunta,
            p.textoPregunta,
            tp.tipo AS tipoPregunta,
            rp.explicacion,
            r.id_respuesta,
            r.texto AS textoRespuesta,
            lv.id_lectura,
            lv.titulo AS lectura_titulo,
            lv.tipo AS lectura_tipo,
            lv.url AS lectura_url
        FROM test_pregunta tp_link
        JOIN preguntas p ON tp_link.id_pregunta = p.id_pregunta
        JOIN tipopregunta tp ON p.id_tipo = tp.id_tipo
        LEFT JOIN resultado_pregunta rp ON p.id_pregunta = rp.id_pregunta
        LEFT JOIN respuestas r ON rp.id_respuesta = r.id_respuesta
        LEFT JOIN lecturas_videos lv ON p.id_pregunta = lv.id_pregunta
        WHERE tp_link.id_test = ?
        ORDER BY p.id_pregunta, r.id_respuesta;
    `;

    try {
        const [results] = await db.query(sql, [id_test]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron preguntas para este test o el test no existe.' });
        }

        // Agrupar resultados por pregunta
        const preguntasMap = new Map();
        results.forEach(row => {
            if (!preguntasMap.has(row.id_pregunta)) {
                preguntasMap.set(row.id_pregunta, {
                    id_pregunta: row.id_pregunta,
                    textoPregunta: row.textoPregunta,
                    tipoPregunta: row.tipoPregunta,
                    explicacion: row.explicacion, // Se usará en la revisión
                    respuestas: [],
                    lecturas_videos: []
                });
            }
            // Añadir respuesta si existe y no es repetida
            if (row.id_respuesta && !preguntasMap.get(row.id_pregunta).respuestas.some(r => r.id_respuesta === row.id_respuesta)) {
                preguntasMap.get(row.id_pregunta).respuestas.push({
                    id_respuesta: row.id_respuesta,
                    texto: row.texto,
                });
            }
             // Añadir lectura/video si existe y no es repetido
             if (row.id_lectura && !preguntasMap.get(row.id_pregunta).lecturas_videos.some(lv => lv.id_lectura === row.id_lectura)) {
                preguntasMap.get(row.id_pregunta).lecturas_videos.push({
                    id_lectura: row.id_lectura,
                    titulo: row.lectura_titulo,
                    tipo: row.lectura_tipo,
                    url: row.lectura_url
                });
            }
        });

        const preguntasList = Array.from(preguntasMap.values());
        res.json(preguntasList);

    } catch (error) {
         console.error("Error al obtener preguntas para el test:", error);
         res.status(500).json({ message: 'Error interno al obtener preguntas del test.' });
    }
};

// Obtener tipos de pregunta
exports.getTiposPregunta = async (req, res) => {
    const sql = 'SELECT id_tipo, tipo FROM tipopregunta ORDER BY tipo';
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (error) {
        console.error("Error al obtener tipos de pregunta:", error);
        res.status(500).json({ message: 'Error interno al obtener tipos de pregunta.' });
    }
};


// --- Funciones para Administración (CRUD de Preguntas) ---

// Obtener TODAS las preguntas con detalles (para admin)
exports.getAllPreguntasAdmin = async (req, res) => {
    const sql = `
        SELECT
            p.id_pregunta, p.textoPregunta, p.explicacion,
            p.id_categoria, cat.nombre AS categoria_nombre,
            p.id_dificultad, dif.dificultad AS dificultad_nombre,
            tp.id_tipo, tp.tipo AS tipoPregunta,
            -- Agrupar respuestas y lecturas/videos
            GROUP_CONCAT(
                CONCAT(
                    '{',
                    '"id_respuesta":', r.id_respuesta, ',',
                    '"texto":"', REPLACE(r.texto, '"', '\\"'), '",',
                    '"es_correcta":', IF(rp.es_correcta = 1, 'true', 'false'),
                    '}'
                )
            ) AS respuestas,
            GROUP_CONCAT(
                CONCAT(
                    '{',
                    '"id_lectura":', lv.id_lectura, ',',
                    '"titulo":"', REPLACE(lv.titulo, '"', '\\"'), '",',
                    '"tipo":"', lv.tipo, '",',
                    '"url":"', lv.url, '"',
                    '}'
                )
            ) AS lecturas_videos
        FROM preguntas p
        JOIN tipopregunta tp ON p.id_tipo = tp.id_tipo
        LEFT JOIN categorias cat ON p.id_categoria = cat.id_categoria -- Asumiendo que preguntas tiene FK a categoria
        LEFT JOIN niveldificultad dif ON p.id_dificultad = dif.id_dificultad -- Asumiendo que preguntas tiene FK a dificultad
        LEFT JOIN resultado_pregunta rp ON p.id_pregunta = rp.id_pregunta
        LEFT JOIN respuestas r ON rp.id_respuesta = r.id_respuesta
        LEFT JOIN lecturas_videos lv ON p.id_pregunta = lv.id_pregunta
        GROUP BY p.id_pregunta
        ORDER BY p.id_pregunta;
    `;
    try {
        const [results] = await db.query(sql);
        // Limpiar respuestas/lecturas nulas si no hay ninguna asociada
        function parseConcatJSON(str) {
            if (!str || typeof str !== 'string') return [];
            try {
                const jsonArray = JSON.parse(`[${str}]`);
                return jsonArray.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id_respuesta ? t.id_respuesta === item.id_respuesta : t.id_lectura === item.id_lectura)
                );
            } catch (err) {
                console.error('Error al parsear JSON:', err, '\nCadena recibida:', str);
                return [];
            }
        }
        const preguntas = results.map(p => ({
            ...p,
            respuestas: parseConcatJSON(p.respuestas),
            lecturas_videos: parseConcatJSON(p.lecturas_videos)
        }));

        res.json(preguntas);

    } catch (error) {
        console.error("Error admin al obtener preguntas:", error);
        res.status(500).json({ message: 'Error interno admin al obtener preguntas.' });
    }
};

// Crear una nueva pregunta (Transacción)
exports.createPregunta = async (req, res) => {
    const { textoPregunta, id_tipo, id_categoria, id_dificultad, explicacion, respuestas, lecturas_videos } = req.body;
    // respuestas es array de { texto: "...", es_correcta: true/false }
    // lecturas_videos es array de { titulo: "...", tipo: "Video/Lectura", url: "..." }

    if (!textoPregunta || !id_tipo || !id_categoria || !id_dificultad || !respuestas || respuestas.length === 0) {
        return res.status(400).json({ message: 'Faltan campos obligatorios (texto, tipo, categoria, dificultad, respuestas).' });
    }
    const connection = await db.getConnection(); // Obtener una conexión del pool

    try {
        await connection.beginTransaction();

        // 1. Insertar la pregunta
        const sqlInsertPregunta = 'INSERT INTO preguntas (textoPregunta, id_tipo, id_categoria, id_dificultad, explicacion) VALUES (?, ?, ?, ?, ?)';
        const [preguntaResult] = await connection.query(sqlInsertPregunta, [textoPregunta, id_tipo, id_categoria, id_dificultad, explicacion || null]);
        const id_pregunta = preguntaResult.insertId;

        // 2. Insertar las respuestas y sus relaciones
        for (const resp of respuestas) {
            // Insertar respuesta en 'respuestas' 
            const sqlInsertRespuesta = 'INSERT INTO respuestas (texto) VALUES (?)';
            const [respuestaResult] = await connection.query(sqlInsertRespuesta, [resp.texto]);
            const id_respuesta = respuestaResult.insertId;

            // Vincular respuesta con pregunta 
            const sqlInsertRpLink = 'INSERT INTO resultado_pregunta (id_pregunta, id_respuesta, es_correcta) VALUES (?, ?, ?)';
            await connection.query(sqlInsertRpLink, [id_pregunta, id_respuesta, resp.es_correcta ? 1 : 0]);
        }

        // 3. Insertar lecturas/videos asociados 
        if (lecturas_videos && lecturas_videos.length > 0) {
            const sqlInsertLectura = 'INSERT INTO lecturas_videos (id_pregunta, titulo, tipo, url) VALUES ?';
            const lecturaValues = lecturas_videos.map(lv => [id_pregunta, lv.titulo, lv.tipo, lv.url]);
            await connection.query(sqlInsertLectura, [lecturaValues]);
        }

        await connection.commit(); // Confirmar transacción
        res.status(201).json({ message: 'Pregunta creada con éxito.', id_pregunta: id_pregunta });

    } catch (error) {
        await connection.rollback(); // Revertir 
        console.error("Error al crear pregunta (transacción):", error);
        res.status(500).json({ message: 'Error interno al crear la pregunta.' });
    } finally {
        connection.release();
    }
};

// Actualizar una pregunta existente 
exports.updatePregunta = async (req, res) => {
    const { id_pregunta } = req.params;
    const { textoPregunta, id_tipo, id_categoria, id_dificultad, explicacion, respuestas, lecturas_videos } = req.body;

     if (!id_pregunta || !textoPregunta || !id_tipo || !id_categoria || !id_dificultad || !respuestas || respuestas.length === 0) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Actualizar la tabla 'preguntas'
        const sqlUpdatePregunta = 'UPDATE preguntas SET textoPregunta = ?, id_tipo = ?, id_categoria = ?, id_dificultad = ?, explicacion = ? WHERE id_pregunta = ?';
        await connection.query(sqlUpdatePregunta, [textoPregunta, id_tipo, id_categoria, id_dificultad, explicacion || null, id_pregunta]);

        // 2.1 Obtener IDs de respuestas viejas asociadas a esta pregunta
        const sqlOldRespIds = 'SELECT id_respuesta FROM resultado_pregunta WHERE id_pregunta = ?';
        const [oldRespLinks] = await connection.query(sqlOldRespIds, [id_pregunta]);
        const oldRespIds = oldRespLinks.map(r => r.id_respuesta);

        // 2.2 Eliminar asociaciones viejas de 'resultado_pregunta'
        const sqlDeleteRpLinks = 'DELETE FROM resultado_pregunta WHERE id_pregunta = ?';
        await connection.query(sqlDeleteRpLinks, [id_pregunta]);

        // 2.4 Insertar las nuevas respuestas y asociaciones (similar a create)
        for (const resp of respuestas) {
            const sqlInsertRespuesta = 'INSERT INTO respuestas (texto) VALUES (?)';
            const [respuestaResult] = await connection.query(sqlInsertRespuesta, [resp.texto]);
            const id_respuesta = respuestaResult.insertId;
            const sqlInsertRpLink = 'INSERT INTO resultado_pregunta (id_pregunta, id_respuesta, es_correcta) VALUES (?, ?, ?)';
            await connection.query(sqlInsertRpLink, [id_pregunta, id_respuesta, resp.es_correcta ? 1 : 0]);
        }

        // 3. Gestionar lecturas/videos: Eliminar antiguas y añadir nuevas
        const sqlDeleteOldLecturas = 'DELETE FROM lecturas_videos WHERE id_pregunta = ?';
        await connection.query(sqlDeleteOldLecturas, [id_pregunta]);

        if (lecturas_videos && lecturas_videos.length > 0) {
            const sqlInsertLectura = 'INSERT INTO lecturas_videos (id_pregunta, titulo, tipo, url) VALUES ?';
            const lecturaValues = lecturas_videos.map(lv => [id_pregunta, lv.titulo, lv.tipo, lv.url]);
            await connection.query(sqlInsertLectura, [lecturaValues]);
        }

        await connection.commit();
        res.json({ message: 'Pregunta actualizada con éxito.', id_pregunta: id_pregunta });

    } catch (error) {
        await connection.rollback();
        console.error(`Error al actualizar pregunta ${id_pregunta} (transacción):`, error);
        res.status(500).json({ message: 'Error interno al actualizar la pregunta.' });
    } finally {
        connection.release();
    }
};

// Eliminar una pregunta 
exports.deletePregunta = async (req, res) => {
    const { id_pregunta } = req.params;
     if (!id_pregunta) return res.status(400).json({ message: 'ID de pregunta requerido.' });

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Obtener IDs de respuestas asociadas (para posible limpieza posterior)
        const sqlOldRespIds = 'SELECT id_respuesta FROM resultado_pregunta WHERE id_pregunta = ?';
        const [oldRespLinks] = await connection.query(sqlOldRespIds, [id_pregunta]);
        const oldRespIds = oldRespLinks.map(r => r.id_respuesta);

        await connection.query('DELETE FROM test_pregunta WHERE id_pregunta = ?', [id_pregunta]);
        await connection.query('DELETE FROM resultado_pregunta WHERE id_pregunta = ?', [id_pregunta]);
        await connection.query('DELETE FROM lecturas_videos WHERE id_pregunta = ?', [id_pregunta]);
        // await connection.query('DELETE FROM resultado_pregunta WHERE id_pregunta = ?', [id_pregunta]); // ¡PELIGROSO!

        // 3. Eliminar la pregunta de la tabla 'preguntas'
        const sqlDeletePregunta = 'DELETE FROM preguntas WHERE id_pregunta = ?';
        const [deleteResult] = await connection.query(sqlDeletePregunta, [id_pregunta]);

        if (deleteResult.affectedRows === 0) {
             throw new Error('Pregunta no encontrada para eliminar.'); // Provoca rollback
        }

        await connection.commit();
        res.json({ message: 'Pregunta eliminada con éxito.' });

    } catch (error) {
        await connection.rollback();
        console.error(`Error al eliminar pregunta ${id_pregunta} (transacción):`, error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ message: 'Error: No se puede eliminar la pregunta porque está referenciada en resultados históricos.' });
        }
        res.status(500).json({ message: 'Error interno al eliminar la pregunta.' });
    } finally {
        connection.release();
    }
};
