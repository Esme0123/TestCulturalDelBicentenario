// controllers/rankingController.js
const db = require('../config/db');

// Obtener rankings (semanal, mensual, general)
exports.getRankings = async(req, res) => {
    const { tipo = 'general', limit = 10 } = req.query; // tipo: 'semanal', 'mensual', 'general'
    let dateCondition = '';

    // Determinar el rango de fechas según el tipo
    if (tipo.toLowerCase() === 'semanal') {
        // Obtener el lunes de esta semana y el domingo
        dateCondition = 'WHERE ht.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    } else if (tipo.toLowerCase() === 'mensual') {
        // Obtener el primer y último día de este mes
        dateCondition = 'WHERE ht.fecha >= DATE_FORMAT(CURDATE(), \'%Y-%m-01\') AND ht.fecha < DATE_ADD(DATE_FORMAT(CURDATE(), \'%Y-%m-01\'), INTERVAL 1 MONTH)';
    }
    // Consulta para obtener los mejores puntajes, agrupando por usuario y tomando el máximo
    // Une con usuarios para obtener el nombre
    const sql = `
        SELECT
            u.id_user,
            u.nombre,
            u.apellidoPaterno,
            MAX(ht.puntaje) AS max_puntaje -- Toma el mejor puntaje del usuario en el período
        FROM historial_tests ht
        JOIN usuarios u ON ht.id_user = u.id_user
        -- ${dateCondition}
        GROUP BY u.id_user, u.nombre, u.apellidoPaterno
        ORDER BY max_puntaje DESC
        LIMIT ?;
    `;

    const limitValue = parseInt(limit, 10) || 10; 
    params.push(limitValue);

    try {
        const limitValue = parseInt(limit, 10) || 10;
        const [results] = await db.query(sql, [limitValue]);
        if (results.length === 0) {
            return res.status(404).json({ message: `No hay puntajes para el ranking ${tipo}.` });
        }
        res.json(results);
    } catch (err) {
        console.error(`Error al obtener ranking ${tipo}:`, err);
        res.status(500).json({ message: `Error interno al obtener ranking ${tipo}.` });
    }
};
