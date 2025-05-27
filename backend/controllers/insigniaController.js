// controllers/insigniaController.js
const db = require('../config/db');

// --- Funciones para Otorgar Insignias (llamadas internamente) ---

/**
 * Verifica criterios y otorga insignias a un usuario si corresponde.
 * Se ejecuta DENTRO de la transacción de submitRespuestasTest.
 * @param {number} id_user - ID del usuario.
 * @param {object} resultadosTest - Objeto con datos del test recién completado.
 * @param {object} connection - Conexión de la base de datos de la transacción activa.
 * @returns {Array<object>} - Array de insignias recién otorgadas.
 */
exports.checkAndAwardInsignias = async (id_user, resultadosTest, connection) => {
    const insigniasOtorgadas = [];
    const fecha = new Date();

    try {
        // 1. Obtener insignias que el usuario YA tiene
        const [poseidas] = await connection.query('SELECT id_insignia FROM usuariosInsignias WHERE id_user = ?', [id_user]);
        const insigniasPoseidasIds = poseidas.map(i => i.id_insignia);

        // 2. Definir criterios y verificar (Ejemplos)
        //    (Asumimos IDs fijos para las insignias o podríamos buscarlas por un 'codigo_criterio')

        // Insignia 1: "Primer Test Completado"
        const ID_INSIGNIA_PRIMER_TEST = 1;
        if (!insigniasPoseidasIds.includes(ID_INSIGNIA_PRIMER_TEST)) {
            // Verificar si es realmente el primer test del usuario
            const [historialCount] = await connection.query('SELECT COUNT(*) as count FROM historial_tests WHERE id_user = ?', [id_user]);
            if (historialCount[0].count === 1) { // Acabamos de insertar el primero
                await connection.query('INSERT INTO usuariosInsignias (id_user, id_insignia, fecha) VALUES (?, ?, ?)', [id_user, ID_INSIGNIA_PRIMER_TEST, fecha]);
                insigniasOtorgadas.push({ id: ID_INSIGNIA_PRIMER_TEST, nombre: "Primer Test Completado" }); // Devolver info básica
                insigniasPoseidasIds.push(ID_INSIGNIA_PRIMER_TEST); // Añadir a poseídas para no volver a verificar
            }
        }

        // Insignia 2: "Puntaje Perfecto"
        const ID_INSIGNIA_PERFECTO = 2;
         if (!insigniasPoseidasIds.includes(ID_INSIGNIA_PERFECTO)) {
            if (resultadosTest.respuestasCorrectas === resultadosTest.totalPreguntas && resultadosTest.totalPreguntas > 0) {
                 await connection.query('INSERT INTO usuariosInsignias (id_user, id_insignia, fecha) VALUES (?, ?, ?)', [id_user, ID_INSIGNIA_PERFECTO, fecha]);
                 insigniasOtorgadas.push({ id: ID_INSIGNIA_PERFECTO, nombre: "Puntaje Perfecto" });
                 insigniasPoseidasIds.push(ID_INSIGNIA_PERFECTO);
            }
         }

        // Insignia 3: "Experto en Historia" (Ej: >90% aciertos en categoría Historia)
        // const ID_INSIGNIA_HISTORIA = 3;
        // const ID_CATEGORIA_HISTORIA = 1; // Asumiendo ID fijo
        // if (!insigniasPoseidasIds.includes(ID_INSIGNIA_HISTORIA)) {
        //      const [statsHistoria] = await connection.query('SELECT respuestas_correctas, preguntas_totales FROM estadisticas_usuario WHERE id_user = ? AND id_categoria = ?', [id_user, ID_CATEGORIA_HISTORIA]);
        //      if (statsHistoria.length > 0 && statsHistoria[0].preguntas_totales >= 10) { // Mínimo 10 preguntas
        //          const porcentaje = (statsHistoria[0].respuestas_correctas / statsHistoria[0].preguntas_totales) * 100;
        //          if (porcentaje >= 90) {
        //              await connection.query('INSERT INTO usuariosInsignias (id_user, id_insignia, fecha) VALUES (?, ?, ?)', [id_user, ID_INSIGNIA_HISTORIA, fecha]);
        //              insigniasOtorgadas.push({ id: ID_INSIGNIA_HISTORIA, nombre: "Experto en Historia" });
        //              insigniasPoseidasIds.push(ID_INSIGNIA_HISTORIA);
        //          }
        //      }
        // }

        // Añadir más criterios aquí...

        return insigniasOtorgadas; // Devolver las nuevas insignias otorgadas en esta ejecución

    } catch (error) {
        console.error(`Error al verificar/otorgar insignias para usuario ${id_user}:`, error);
        // NO lanzar error aquí para no romper la transacción principal, solo loguear.
        // La transacción principal hará rollback si hay un error SQL real.
        return []; // Devolver array vacío en caso de error lógico aquí
    }
};


// --- Funciones para API (llamadas desde el frontend) ---

// Obtener todas las insignias disponibles (para mostrarlas quizás)
exports.getAllInsignias = async (req, res) => {
    try {
        // Añadir campos como 'descripcion', 'icono_url' si existen en la tabla
        const [insignias] = await db.query('SELECT id_insignia, nombre, descripcion FROM insignias ORDER BY nombre');
        res.json(insignias);
    } catch (error) {
        console.error("Error al obtener insignias:", error);
        res.status(500).json({ message: 'Error interno al obtener insignias.' });
    }
};

// Obtener las insignias ganadas por el usuario logueado
exports.getMisInsignias = async (req, res) => {
    const id_user = req.userId;
    try {
        const sql = `
            SELECT
                i.id_insignia,
                i.nombre,
                i.descripcion,
                ui.fecha AS fecha_obtenida
                -- i.icono_url si existe
            FROM usuariosInsignias ui
            JOIN insignias i ON ui.id_insignia = i.id_insignia
            WHERE ui.id_user = ?
            ORDER BY ui.fecha DESC;
        `;
        const [misInsignias] = await db.query(sql, [id_user]);
        res.json(misInsignias);
    } catch (error) {
        console.error("Error al obtener mis insignias:", error);
        res.status(500).json({ message: 'Error interno al obtener mis insignias.' });
    }
};
