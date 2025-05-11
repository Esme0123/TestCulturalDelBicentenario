// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente la devuelve.
  (error) => {
    // Si el error es un 401 (No Autorizado), podría significar que el token
    // es inválido o ha expirado.
    if (error.response && error.response.status === 401) {
      console.error("Error 401: No autorizado. Puede que el token haya expirado.");
      // Aquí es donde podrías, por ejemplo, forzar un logout global.
      // Esto es un poco más avanzado de implementar directamente aquí sin causar
      // dependencias circulares con AuthContext.
      // Por ahora, lo más simple es que AuthContext maneje la limpieza del token
      // si una llamada API falla con 401.
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Podrías forzar una recarga o redirigir a la página de login:
      // window.location.href = '/login'; // Esto es un hard refresh.
    }
    
    return Promise.reject(error);
  }
);

export default api;
