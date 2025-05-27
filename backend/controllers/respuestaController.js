// controllers/respuestaController.js
const db = require('../config/db');
const insigniaController = require('./insigniaController'); // Importar para llamar a la función de otorgar

// Procesar las respuestas de un usuario para un test
exports.submitRespuestasTest = async (req, res) => {
    const id_user = req.userId;
    const { id_test, respuestas_usuario, duracion_segundos } = req.body;

    if (!id_user || !id_test || !respuestas_usuario || !Array.isArray(respuestas_usuario) || respuestas_usuario.length === 0) {
        return res.status(400).json({ message: 'Faltan datos requeridos (usuario, test, respuestas).' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Obtener las preguntas, correctas, tipo, explicación y categoría del test
        const preguntasCorrectas = await getPreguntasYCorrectas(id_test, connection);
        if (!preguntasCorrectas || preguntasCorrectas.size === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: 'Test no encontrado o sin preguntas válidas.' });
        }

        let puntaje = 0;
        let respuestasParaGuardar = [];
        let estadisticasCategoria = {};
        const totalPreguntasTest = preguntasCorrectas.size;
        let respuestasCorrectasCount = 0;

        // 2. Evaluar cada respuesta del usuario
        for (const respUsuario of respuestas_usuario) {
            const id_pregunta = respUsuario.id_pregunta;
            const preguntaInfo = preguntasCorrectas.get(id_pregunta);

            if (!preguntaInfo) {
                console.warn(`Pregunta ${id_pregunta} enviada por usuario no encontrada en el test ${id_test}`);
                continue;
            }

            const id_categoria = preguntaInfo.id_categoria;
            if (!estadisticasCategoria[id_categoria]) {
                estadisticasCategoria[id_categoria] = { correctas: 0, totales: 0 };
            }
            estadisticasCategoria[id_categoria].totales++;

            let es_correcta = false;
            let id_respuesta_db = respUsuario.id_respuesta_seleccionada || null;
            let texto_respuesta_abierta_db = null;

            if (preguntaInfo.tipoPregunta === 'Abierta') {
                es_correcta = false; // Requiere revisión manual
                texto_respuesta_abierta_db = respUsuario.texto_respuesta || null; // Guardar texto
                console.warn(`Evaluación automática de pregunta abierta ${id_pregunta} no implementada.`);
            } else {
                if (id_respuesta_db !== null && preguntaInfo.ids_correctas.includes(id_respuesta_db)) {
                    es_correcta = true;
                    puntaje += 10; // Puntuación base
                    estadisticasCategoria[id_categoria].correctas++;
                    respuestasCorrectasCount++;
                }
            }

            respuestasParaGuardar.push([
                null, // id_resultado_pregunta (autoincrement)
                null, // id_historial (se asignará después)
                id_pregunta,
                id_respuesta_db,
                texto_respuesta_abierta_db,
                es_correcta,
                preguntaInfo.explicacion // Guardar explicación para revisión
            ]);
        }

        // 3. Guardar el resultado general en 'historial_tests'
        const fecha = new Date();
        const sqlInsertHistorial = `
            INSERT INTO historial_tests (id_user, id_test, fecha, puntaje, total, duracion_segundos)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [historialResult] = await connection.query(sqlInsertHistorial, [id_user, id_test, fecha, puntaje, totalPreguntasTest, duracion_segundos || null]);
        const id_historial = historialResult.insertId;

        // 4. Actualizar id_historial en las respuestas preparadas y guardar en 'resultado_pregunta'
        if (respuestasParaGuardar.length > 0) {
            const valuesResultados = respuestasParaGuardar.map(r => {
                r[1] = id_historial; // Asignar el id_historial
                return r;
            });
            const sqlInsertResultados = `
                INSERT INTO resultado_pregunta (id_resultado_pregunta, id_historial, id_pregunta, id_respuesta, texto_respuesta_abierta, es_correcta, explicacion)
                VALUES ?
            `;
            await connection.query(sqlInsertResultados, [valuesResultados]);
        }

        // 5. Actualizar 'estadisticas_usuario'
        for (const [id_cat, stats] of Object.entries(estadisticasCategoria)) {
            if (stats.totales > 0) { 
                 const sqlUpdateStats = `
                    INSERT INTO estadisticas_usuario (id_user, id_categoria, preguntas_totales, respuestas_correctas)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    preguntas_totales = preguntas_totales + VALUES(preguntas_totales),
                    respuestas_correctas = respuestas_correctas + VALUES(respuestas_correctas);
                `;
                await connection.query(sqlUpdateStats, [id_user, id_cat, stats.totales, stats.correctas]);
            }
        }

        // 6. Otorgar insignias (Llamar a la función específica)
        const insigniasOtorgadas = await insigniaController.checkAndAwardInsignias(id_user, {
            puntaje: puntaje,
            totalPreguntas: totalPreguntasTest,
            respuestasCorrectas: respuestasCorrectasCount,
            id_test: id_test,
            
        }, connection); 

        await connection.commit();

        // 7. Devolver el resultado al usuario
        res.json({
            message: 'Test completado y respuestas guardadas.',
            id_historial: id_historial,
            puntaje: puntaje,
            totalPreguntas: totalPreguntasTest,
            respuestasCorrectas: respuestasCorrectasCount,
            insigniasNuevas: insigniasOtorgadas // Informar al frontend sobre nuevas insignias
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error durante el procesamiento de respuestas:", error);
        res.status(500).json({ message: 'Error interno al guardar las respuestas.' });
    } finally {
        connection.release();
    }
};


// Función auxiliar para obtener info de preguntas del test (usando la conexión de la transacción)
async function getPreguntasYCorrectas(id_test, connection) {
    const sql = `
        SELECT
            p.id_pregunta,
            tp.tipo AS tipoPregunta,
            r.id_respuesta,
            r.es_correcta,
            p.explicacion,
            t.id_categoria
        FROM test_pregunta tp_link
        JOIN preguntas p ON tp_link.id_pregunta = p.id_pregunta
        JOIN tipopregunta tp ON p.id_tipo = tp.id_tipo
        JOIN tests t ON tp_link.id_test = t.id_test
        JOIN respuestapreguntas rp ON p.id_pregunta = rp.id_pregunta
        JOIN respuestas r ON rp.id_respuesta = r.id_respuesta
        WHERE tp_link.id_test = ?;
    `;
    try {
        const [results] = await connection.query(sql, [id_test]);
        if (results.length === 0) return null;

        const preguntasMap = new Map();
        results.forEach(row => {
            if (!preguntasMap.has(row.id_pregunta)) {
                preguntasMap.set(row.id_pregunta, {
                    tipoPregunta: row.tipoPregunta,
                    ids_correctas: [],
                    explicacion: row.explicacion,
                    id_categoria: row.id_categoria
                });
            }
            // Solo añadir a ids_correctas si es correcta y tiene id_respuesta
            if (row.es_correcta && row.id_respuesta) {
                preguntasMap.get(row.id_pregunta).ids_correctas.push(row.id_respuesta);
            }
        });
        return preguntasMap;
    } catch (error) {
        console.error("Error al obtener preguntas y correctas:", error);
        throw error; // Propagar el error para el rollback
    }
}
