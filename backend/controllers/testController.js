// controllers/testController.js
const db = require('../config/db');


exports.crearTest =async(req, res) => {
  const id_user = req.userId;
  const { nombre, descripcion, id_dificultad, id_categoria, es_personalizado = false, preguntas } = req.body; // preguntas es opcional para tests personalizados

  if (!id_user || !nombre || !id_dificultad || !id_categoria) {
    return res.status(400).json({ message: 'Faltan campos requeridos (usuario, nombre, dificultad, categoría).' });
  }

  try {
    // 1. Insertar test
    const [result] = await db.query(
      'INSERT INTO tests (nombre, descripcion, id_dificultad, id_categoria) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, id_dificultad, id_categoria]
    );
    const id_test = result.insertId;

    // 2. Si no es personalizado
    if (!es_personalizado || !preguntas || preguntas.length === 0) {
      console.warn("Advertencia: La selección automática de preguntas no está implementada.");
      return res.status(201).json({
        message: 'Test base creado con éxito. Asocia las preguntas.',
        id_test: id_test
      });
    }

    // 3. Si es personalizado y hay preguntas
    const values = preguntas.map(id_pregunta => [id_test, id_pregunta]);
    await db.query('INSERT INTO test_pregunta (id_test, id_pregunta) VALUES ?', [values]);
    return res.status(201).json({
      message: 'Test personalizado creado y preguntas asociadas con éxito.',
      id_test: id_test
    });

  } catch (err) {
    console.error("Error al crear test:", err);
    return res.status(500).json({ message: 'Error interno al crear el test o asociar preguntas.' });
  }
};


exports.getTestsDisponibles = async(req, res) => {
    const { id_categoria, id_dificultad, es_publico } = req.query;

    let sql = `
        SELECT
            t.id_test, t.nombre, t.descripcion,
            c.nombre AS categoria_nombre,
            nd.dificultad AS dificultad_nombre
        FROM tests t
        JOIN categorias c ON t.id_categoria = c.id_categoria
        JOIN niveldificultad nd ON t.id_dificultad = nd.id_dificultad
    `;
    const params = [];
    const conditions = [];

    if (id_categoria) {
        conditions.push('t.id_categoria = ?');
        params.push(id_categoria);
    }
    if (id_dificultad) {
        conditions.push('t.id_dificultad = ?');
        params.push(id_dificultad);
    }
    if (es_publico !== undefined) {
        conditions.push('t.es_publico = ?');
        params.push(es_publico === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.nombre;';

    try {
        const [results] = await db.query(sql, params);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tests con esos criterios.' });
        }
        res.json(results);
    } catch (err) {
        console.error("Error al obtener tests disponibles:", err);
        res.status(500).json({ message: 'Error interno al obtener tests.' });
    }
};


// Obtener detalles de un test específico 
exports.getTestById = async(req, res) => {
    const { id_test } = req.params;
    const sql = `
        SELECT
            t.id_test, t.nombre, t.descripcion,
            t.id_categoria, c.nombre AS categoria_nombre,
            t.id_dificultad, nd.dificultad AS dificultad_nombre
        FROM tests t
        JOIN categorias c ON t.id_categoria = c.id_categoria
        JOIN niveldificultad nd ON t.id_dificultad = nd.id_dificultad
        WHERE t.id_test = ?;
    `;
    try {
      const [results] = await db.query(sql, [id_test]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'Test no encontrado.' });
      }
      res.json(results[0]);
    } catch (err) {
      console.error("Error al obtener detalle del test:", err);
      res.status(500).json({ message: 'Error interno al obtener detalle del test.' });
    }
};
