// controllers/dificultadController.js
const db = require('../config/db'); // Ajusta la ruta

// Obtener todos los niveles de dificultad
exports.getAllDificultades = async(req, res) => {
    try {
        const [results] = await db.query('SELECT id_dificultad, dificultad FROM niveldificultad ORDER BY id_dificultad');
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron niveles de dificultad.' });
        }

        res.json(results);
    } catch (err) {
        console.error("Error al obtener dificultades:", err);
        res.status(500).json({ message: 'Error interno al obtener niveles de dificultad.' });
    }
};

// Crear un nuevo nivel 
/*
exports.createDificultad = async (req, res) => {
    const { dificultad } = req.body;

    if (!dificultad) {
        return res.status(400).json({ message: 'El nombre de la dificultad es requerido.' });
    }
    try {
        const [result] = await db.query('INSERT INTO niveldificultad (dificultad) VALUES (?)', [dificultad]);
        res.status(201).json({
            message: 'Nivel de dificultad creado con éxito.',
            id_dificultad: result.insertId
        });
    } catch (err) {
        console.error("Error al crear dificultad:", err);
        res.status(500).json({ message: 'Error interno al crear el nivel de dificultad.' });
    }
};
*/
