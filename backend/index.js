// index.js (Backend Principal)
const dotenv = require('dotenv'); 
const express = require('express');
const cors = require('cors');

// Importa la conexión a la base de datos
const db = require('./config/db'); 

// Importa las rutas
const authRoutes = require('./routes/authRoutes');
const preguntaRoutes = require('./routes/preguntaRoutes');
const respuestaRoutes = require('./routes/respuestaRoutes');
const testPreguntaRoutes = require('./routes/testPreguntaRoutes'); 
const rankingRoutes = require('./routes/rankingRoutes');
const testRoutes = require('./routes/testRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const dificultadRoutes = require('./routes/dificultadRoutes');
const historialRoutes = require('./routes/historialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const insigniaRoutes = require('./routes/insigniaRoutes');
const desafioRoutes = require('./routes/desafioRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Montaje de Rutas API v1
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/preguntas', preguntaRoutes);
apiRouter.use('/respuestas', respuestaRoutes);
apiRouter.use('/test-pregunta', testPreguntaRoutes); 
apiRouter.use('/rankings', rankingRoutes);
apiRouter.use('/tests', testRoutes);
apiRouter.use('/categorias', categoriaRoutes);
apiRouter.use('/dificultades', dificultadRoutes);
apiRouter.use('/historial', historialRoutes);
apiRouter.use('/insignias', insigniaRoutes);
apiRouter.use('/desafios', desafioRoutes);
apiRouter.use('/admin', adminRoutes);

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('API Test Bicentenario - Backend Activo');
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada en la API.' });
});

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Error interno del servidor.' : err.message;
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 3000;

// Primero, intentar conectar a la DB y luego iniciar el servidor
db.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos verificada exitosamente (ID ' + connection.threadId + ')');
    connection.release(); // Liberar la conexión

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('CRÍTICO: No se pudo conectar a la base de datos al iniciar la aplicación.');
    console.error('Error:', err.message);
    if (err.code) console.error('Código de error MySQL:', err.code);
    console.error("Por favor, verifica las variables de entorno en '.env' y que el servidor MySQL esté corriendo.");
    process.exit(1); 
  });
