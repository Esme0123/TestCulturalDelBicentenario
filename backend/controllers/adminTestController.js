// controllers/adminTestController.js
const db = require('../config/db'); // Ya exporta la versión con promesas

// Obtener todos los tests (vista de administrador)
// Podría incluir más detalles o no filtrar por 'es_publico'
exports.getAllTestsAdmin = async (req, res) => {
    try {
        // Unir con categorías y dificultades para mostrar nombres
        const sql = `
            SELECT 
                t.id_test, t.nombre, t.descripcion, t.es_publico,
                t.fecha_creacion,
                c.id_categoria, c.nombre AS categoria_nombre,
                nd.id_dificultad, nd.dificultad AS dificultad_nombre,
                u.email AS creador_email, u.id_user AS id_usuario_creador,
                (SELECT COUNT(*) FROM test_pregunta tp WHERE tp.id_test = t.id_test) AS cantidad_preguntas
            FROM tests t
            JOIN categorias c ON t.id_categoria = c.id_categoria
            JOIN niveldificultad nd ON t.id_dificultad = nd.id_dificultad
            LEFT JOIN usuarios u ON t.id_usuario_creador = u.id_user 
            ORDER BY t.fecha_creacion DESC;
        `;
        const [tests] = await db.query(sql);
        res.json(tests);
    } catch (error) {
        console.error("Error al obtener todos los tests (admin):", error);
        res.status(500).json({ message: 'Error interno al obtener la lista de tests.' });
    }
};

// Obtener un test específico por ID (vista de administrador)
exports.getTestByIdAdmin = async (req, res) => {
    const { id_test } = req.params;
    try {
        const sql = `
            SELECT 
                t.id_test, t.nombre, t.descripcion, t.es_publico,
                t.id_categoria, c.nombre AS categoria_nombre,
                t.id_dificultad, nd.dificultad AS dificultad_nombre,
                t.id_usuario_creador, u.email AS creador_email
            FROM tests t
            JOIN categorias c ON t.id_categoria = c.id_categoria
            JOIN niveldificultad nd ON t.id_dificultad = nd.id_dificultad
            LEFT JOIN usuarios u ON t.id_usuario_creador = u.id_user
            WHERE t.id_test = ?;
        `;
        const [tests] = await db.query(sql, [id_test]);
        if (tests.length === 0) {
            return res.status(404).json({ message: 'Test no encontrado.' });
        }
        res.json(tests[0]);
    } catch (error) {
        console.error(`Error al obtener test ${id_test} (admin):`, error);
        res.status(500).json({ message: 'Error interno al obtener el test.' });
    }
};

// Crear un nuevo test base (admin)
exports.createTestAdmin = async (req, res) => {
    const { nombre, descripcion, id_categoria, id_dificultad, es_publico = true } = req.body;
    const id_usuario_creador = req.userId; // ID del admin logueado, desde verifyAdmin/verifyToken

    if (!nombre || !id_categoria || !id_dificultad) {
        return res.status(400).json({ message: 'Nombre, categoría y dificultad son requeridos.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const sqlInsert = `
            INSERT INTO tests (nombre, descripcion, id_categoria, id_dificultad, id_usuario_creador, es_publico) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await connection.query(sqlInsert, [
            nombre,
            descripcion || null,
            parseInt(id_categoria),
            parseInt(id_dificultad),
            id_usuario_creador, // El admin que lo crea
            es_publico ? 1 : 0
        ]);

        await connection.commit();
        res.status(201).json({ message: 'Test base creado correctamente.', id_test: result.insertId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al crear test base (admin):", error);
        res.status(500).json({ message: 'Error interno al crear el test base.' });
    } finally {
        if (connection) connection.release();
    }
};

// Actualizar un test base (admin)
exports.updateTestAdmin = async (req, res) => {
    const { id_test } = req.params;
    const { nombre, descripcion, id_categoria, id_dificultad, es_publico } = req.body;

    if (!nombre || !id_categoria || !id_dificultad || es_publico === undefined) {
        return res.status(400).json({ message: 'Nombre, categoría, dificultad y estado público son requeridos.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const sqlUpdate = `
            UPDATE tests SET 
                nombre = ?, 
                descripcion = ?, 
                id_categoria = ?, 
                id_dificultad = ?,
                es_publico = ?
            WHERE id_test = ?;
        `;
        const [result] = await connection.query(sqlUpdate, [
            nombre,
            descripcion || null,
            parseInt(id_categoria),
            parseInt(id_dificultad),
            es_publico ? 1 : 0,
            id_test
        ]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Test no encontrado o datos sin cambios.' });
        }

        await connection.commit();
        res.json({ message: `Test ${id_test} actualizado correctamente.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Error al actualizar test ${id_test} (admin):`, error);
        res.status(500).json({ message: 'Error interno al actualizar el test.' });
    } finally {
        if (connection) connection.release();
    }
};

// Eliminar un test base (admin)
exports.deleteTestAdmin = async (req, res) => {
    const { id_test } = req.params;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        // 3. Eliminar el test
        const [result] = await connection.query('DELETE FROM tests WHERE id_test = ?', [id_test]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Test no encontrado para eliminar.' });
        }

        await connection.commit();
        res.json({ message: `Test ${id_test} eliminado correctamente.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Error al eliminar test ${id_test} (admin):`, error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') { // Error de FK por historial_tests
            return res.status(409).json({ message: 'No se puede eliminar el test porque tiene historial de usuarios asociado. Considere marcarlo como no público o eliminar el historial primero (con precaución).' });
        }
        res.status(500).json({ message: 'Error interno al eliminar el test.' });
    } finally {
        if (connection) connection.release();
    }
};
