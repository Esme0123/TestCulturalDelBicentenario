// controllers/categoriaController.js
const db = require('../config/db'); 

// Obtener todas las categorías
exports.getAllCategorias = async (req, res) => {
    const sql = 'SELECT id_categoria, nombre, descripcion FROM categorias ORDER BY nombre';
    try {
        // Usar await para esperar el resultado de la promesa
        const [results] = await db.query(sql); // db.query() ahora devuelve [results, fields]

        if (results.length === 0) {
            return res.json([]);
            return res.status(404).json({ message: 'No se encontraron categorías.' });
        }
        res.json(results);
    } catch (err) {
        console.error("Error al obtener categorías:", err);
        res.status(500).json({ message: 'Error interno al obtener categorías.' });
    }
};

// Crear una nueva categoría
/*
exports.createCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
    }
    const sql = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
    let connection;
    try {
        connection = await db.getConnection(); // Para transacciones o múltiples queries
        await connection.beginTransaction();
        const [result] = await connection.query(sql, [nombre, descripcion || null]);
        await connection.commit();
        res.status(201).json({ message: 'Categoría creada con éxito.', id_categoria: result.insertId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error("Error al crear categoría:", err);
        res.status(500).json({ message: 'Error interno al crear la categoría.' });
    } finally {
        if (connection) connection.release();
    }
};
*/
