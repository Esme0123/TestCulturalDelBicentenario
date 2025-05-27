const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Separa "Bearer token" y toma solo el token
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  try {
    // Verificar el token usando el secreto del archivo .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Añadir el id del usuario (y rol si existe en el token) al objeto request
    req.userId = decoded.id;
    req.userRole = decoded.rol; // Asumiendo que incluyes el rol en el token al hacer login
    next(); // Pasar al siguiente middleware 
  } catch (err) {
    // Token inválido o expirado
    console.error("Error de verificación de token:", err.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
// Middleware específico para verificar si el usuario es administrador
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => { // Primero verifica el token
      if (req.userRole && req.userRole.toLowerCase() === 'admin') {
          next(); // Si es admin, continuar
      } else {
          return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
      }
  });
}
module.exports = { verifyToken, verifyAdmin };