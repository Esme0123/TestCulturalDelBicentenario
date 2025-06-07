// controllers/adminDashboardController.js
const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) as count FROM usuarios');
        const [tests] = await db.query('SELECT COUNT(*) as count FROM tests');
        const [questions] = await db.query('SELECT COUNT(*) as count FROM preguntas');

        res.json({
            users: users[0].count,
            tests: tests[0].count,
            questions: questions[0].count,
        });
    } catch (error) {
        console.error("Error al obtener estadísticas del dashboard:", error);
        res.status(500).json({ message: 'Error interno al obtener las estadísticas.' });
    }
};
