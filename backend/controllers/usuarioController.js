const db = require('../config/db');

exports.getUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id_user, nombre, apellidoPaterno, email FROM usuarios WHERE id_user != ?',
      [req.userId]
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno al obtener usuarios.' });
  }
};
