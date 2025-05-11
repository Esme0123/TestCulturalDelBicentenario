// controllers/desafioController.js
const db = require('../config/db');

// Crear un nuevo desafío (retar a otro usuario)
exports.crearDesafio = async (req, res) => {
    const id_usuario_creador = req.userId;
    const { id_usuario_retado, id_test } = req.body; // Se necesita un test base para el desafío

    if (!id_usuario_retado || !id_test) {
        return res.status(400).json({ message: 'Se requiere usuario retado y test base.' });
    }
    if (id_usuario_creador === parseInt(id_usuario_retado, 10)) {
         return res.status(400).json({ message: 'No puedes retarte a ti mismo.' });
    }

    try {
        // Obtener info del test (categoría, dificultad)
        const [testInfo] = await db.query('SELECT id_categoria, id_dificultad FROM tests WHERE id_test = ?', [id_test]);
        if (testInfo.length === 0) {
            return res.status(404).json({ message: 'Test base no encontrado.' });
        }
        const { id_categoria, id_dificultad } = testInfo[0];

        // Verificar que el usuario retado exista
        const [userRetado] = await db.query('SELECT id_user FROM usuarios WHERE id_user = ?', [id_usuario_retado]);
         if (userRetado.length === 0) {
            return res.status(404).json({ message: 'Usuario retado no encontrado.' });
        }

        // Asumir un estado inicial 'Pendiente' (ID 1?)
        const ID_ESTADO_PENDIENTE = 1; // Buscar ID en tabla 'estados'
        const fecha_inicio = new Date();

        const sqlInsert = `
            INSERT INTO desafios (id_test_base, id_categoria, id_dificultad, id_usuario_creador, id_usuario_retado, id_estado, fecha_inicio)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // Nota: Renombré id_test a id_test_base en la tabla desafios para claridad
        const [result] = await db.query(sqlInsert, [id_test, id_categoria, id_dificultad, id_usuario_creador, id_usuario_retado, ID_ESTADO_PENDIENTE, fecha_inicio]);

        // Aquí iría la lógica de notificación (si hubiera, ej. WebSockets o email)

        res.status(201).json({ message: 'Desafío creado con éxito.', id_desafio: result.insertId });

    } catch (error) {
        console.error("Error al crear desafío:", error);
        res.status(500).json({ message: 'Error interno al crear el desafío.' });
    }
};

// Obtener desafíos pendientes del usuario logueado (donde es retado)
exports.getDesafiosPendientes = async (req, res) => {
    const id_user = req.userId;
    const ID_ESTADO_PENDIENTE = 1; 

    try {
        const sql = `
            SELECT
                d.id_desafio,
                d.fecha_inicio,
                t.nombre AS test_nombre,
                c.nombre AS categoria_nombre,
                nd.dificultad AS dificultad_nombre,
                u_creador.nombre AS creador_nombre
            FROM desafios d
            JOIN tests t ON d.id_test_base = t.id_test
            JOIN categorias c ON d.id_categoria = c.id_categoria
            JOIN niveldificultad nd ON d.id_dificultad = nd.id_dificultad
            JOIN usuarios u_creador ON d.id_usuario_creador = u_creador.id_user
            WHERE d.id_usuario_retado = ? AND d.id_estado = ?
            ORDER BY d.fecha_inicio DESC;
        `;
        const [desafios] = await db.query(sql, [id_user, ID_ESTADO_PENDIENTE]);
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
            SET id_estado = ?, fecha_fin = IF(? = ?, NOW(), fecha_fin) -- Poner fecha fin si se rechaza
            WHERE id_desafio = ? AND id_usuario_retado = ? AND id_estado = ?;
        `;
        const [result] = await db.query(sqlUpdate, [nuevo_estado, nuevo_estado, ID_ESTADO_RECHAZADO, id_desafio, id_user, ID_ESTADO_PENDIENTE]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Desafío no encontrado, no pertenece al usuario o ya fue respondido.' });
        }

        // Lógica de notificación al creador...

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
