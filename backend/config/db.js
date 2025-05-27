// config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({ path: require('node:path').resolve(process.cwd(), '.env') }); 

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Verificar que las variables de entorno esenciales estén cargadas
if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
  console.error("Error: Faltan variables de entorno críticas para la base de datos (DB_HOST, DB_USER, DB_NAME).");
  console.error("Asegúrate de que el archivo .env exista en la carpeta 'backend' y esté configurado correctamente.");
  process.exit(1);
} else {
  console.log("Configuración de DB cargada:");
}

let pool;

try {
  pool = mysql.createPool(dbConfig);
} catch (error) {
  console.error("Error crítico al intentar crear el pool de conexiones MySQL:", error);
  console.error("Verifica la configuración de la base de datos y las variables de entorno.");
  process.exit(1); 
}

module.exports = pool.promise();
