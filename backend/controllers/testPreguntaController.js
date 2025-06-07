// controllers/testPreguntaController.js
const db = require('../config/db');
exports.asociarPreguntasAlTest = async (req, res) => {
  const { id_test, preguntas } = req.body; // 'preguntas' es un array de id_pregunta

  if (!id_test || !preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ message: 'Se requiere id_test y un array de IDs de preguntas.' });
  }

  // Validar que todos los IDs de preguntas sean números
  if (!preguntas.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({ message: 'El array de preguntas debe contener IDs numéricos válidos.' });
  }

  let connection;

  try {
    connection = await db.getConnection(); 
    await connection.beginTransaction();

    // 1. Verificar que el test exista
    const [testRows] = await connection.query('SELECT id_test FROM tests WHERE id_test = ?', [id_test]);
    if (testRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: `El test con ID ${id_test} no existe.` });
    }

    // 2. Verificar que todas las preguntas a asociar existan (opcional pero recomendado)
    const placeholders = preguntas.map(() => '?').join(',');
    const [existingPreguntasRows] = await connection.query(`SELECT id_pregunta FROM preguntas WHERE id_pregunta IN (${placeholders})`, preguntas);
    
    if (existingPreguntasRows.length !== preguntas.length) {
        const existingIds = existingPreguntasRows.map(p => p.id_pregunta);
        const missingIds = preguntas.filter(id => !existingIds.includes(id));
        await connection.rollback();
        return res.status(404).json({ message: `Una o más preguntas no existen. IDs no encontrados: ${missingIds.join(', ')}` });
    }


    // 3. Preparar los valores para la inserción múltiple
    const values = preguntas.map(id_pregunta => [id_test, id_pregunta]);
    const sqlInsert = 'INSERT IGNORE INTO test_pregunta (id_test, id_pregunta) VALUES ?';
    const [result] = await connection.query(sqlInsert, [values]);

    await connection.commit();

    if (result.affectedRows > 0 || result.warningStatus === 0) { 
        const message = result.affectedRows > 0
            ? `${result.affectedRows} pregunta(s) nueva(s) asociada(s) exitosamente al test ${id_test}.`
            : `Las preguntas ya estaban asociadas o no se realizaron cambios para el test ${id_test}.`;
        res.status(201).json({
            message: message,
            id_test: id_test,
            nuevas_asociaciones: result.affectedRows,
            total_intentadas: preguntas.length
        });
    } else {
         res.status(200).json({
            message: `No se realizaron nuevas asociaciones. Es posible que todas las preguntas ya estuvieran vinculadas al test ${id_test}.`,
            id_test: id_test,
            nuevas_asociaciones: 0,
            total_intentadas: preguntas.length
        });
    }


  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al asociar preguntas al test:", error);
    res.status(500).json({ message: 'Error interno del servidor al asociar preguntas al test.' });
  } finally {
    if (connection) connection.release(); 
  }
};


