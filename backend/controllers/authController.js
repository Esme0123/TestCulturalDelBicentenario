const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, email, contrasena, rol = 'user' } = req.body; // Rol por defecto 'user'
  // Validaciones básicas
  if (!nombre || !apellidoPaterno || !email || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos obligatorios (nombre, apellido paterno, email, contraseña).' });
  }
  if (contrasena.length < 5) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }
  let connection;
  try {
    connection = await db.getConnection();
    // 1. Verificar si el email ya existe
    const checkSql = 'SELECT id_user FROM usuarios WHERE email = ?';
    const [existingUsers] = await connection.query(checkSql, [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
    // 2. Hashear la contraseña de forma asíncrona
    const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el número de rondas de salting
    // 3. Insertar usuario en la base de datos
    const insertSql = 'INSERT INTO usuarios (nombre, apellidoPaterno, apellidoMaterno, email, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(insertSql, [nombre, apellidoPaterno, apellidoMaterno || null, email, hashedPassword, rol]);
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Usuario registrado correctamente.', userId: result.insertId });
    } else {
      res.status(500).json({ message: 'No se pudo registrar el usuario.' });
    }
  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'El email ya está registrado (error de duplicado).' });
    }
    res.status(500).json({ message: 'Error interno del servidor durante el registro.' });
  } finally {
    if (connection) connection.release(); 
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }
  let connection;
  try {
    connection = await db.getConnection();
    const sql = 'SELECT id_user, nombre, apellidoPaterno, apellidoMaterno, email, contrasena, rol FROM usuarios WHERE email = ?';
    const [results] = await connection.query(sql, [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas (email no encontrado).' });
    }
    const usuario = results[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas (contraseña incorrecta).' });
    }

    // Generar el token JWT
    const tokenPayload = {
      id: usuario.id_user,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    };
    if (!process.env.JWT_SECRET) {
        console.error("CRÍTICO: JWT_SECRET no está definido en las variables de entorno.");
        return res.status(500).json({ message: "Error de configuración del servidor (JWT)." });
    }
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    res.json({
      message: 'Inicio de sesión exitoso.',
      token: token,
      usuario: { // Enviar datos del usuario sin la contraseña
        id: usuario.id_user,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en el proceso de login:", error);
    res.status(500).json({ message: 'Error interno del servidor durante el inicio de sesión.' });
  } finally {
    if (connection) connection.release();
  }
};
