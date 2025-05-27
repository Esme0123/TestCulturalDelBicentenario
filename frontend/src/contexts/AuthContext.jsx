// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api'; // Importar la instancia de Axios configurada

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken')); // Leer token inicial
  const [loading, setLoading] = useState(true); // Para la carga inicial de verificación de token

  // Efecto para configurar el header de Axios y localStorage cuando el token cambie
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser'); // También limpiar datos de usuario
      setUser(null); // Asegurarse que user es null si no hay token
    }
  }, [token]);

  // Función para verificar el token al cargar la app
  const verifyAuthStatus = useCallback(async () => {
    setLoading(true);
    const currentToken = localStorage.getItem('authToken'); // Re-leer por si acaso
    if (!currentToken) {
      setUser(null);
      setToken(null); // Asegurar que el estado del token también esté limpio
      setLoading(false);
      return;
    }

    // Si hay token, intentar obtener los datos del usuario del localStorage primero
    // Esto evita una llamada a API si los datos ya están y el token es válido.
    // La validación real del token ocurrirá en la primera llamada API protegida.
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Validar que el token en localStorage coincida con el que tenemos en estado (opcional)
        if (token === currentToken) {
            setUser(parsedUser);
        } else {
            // Discrepancia, mejor limpiar
            localStorage.removeItem('authUser');
            setUser(null);
            // Podrías intentar decodificar el currentToken aquí si tienes jwt-decode
            // y si el token tiene la info del usuario, pero es más seguro
            // depender del login para establecer 'authUser' en localStorage.
        }
      } else {
        // No hay datos de usuario en localStorage, aunque haya token.
        // Esto puede pasar si el login no guardó 'authUser' o si se limpió.
        // Podrías intentar un endpoint /auth/me si lo tienes, o forzar logout.
        // Por ahora, si no hay 'authUser', tratamos como no logueado para evitar mostrar
        // datos incorrectos. El token sigue ahí para la primera llamada API.
        setUser(null);
      }
    } catch (error) {
        console.error("Error parseando usuario de localStorage:", error);
        localStorage.removeItem('authUser');
        setUser(null);
    } finally {
        setLoading(false);
    }
  }, [token]); // Depender de token para re-evaluar si cambia externamente (poco probable)

  useEffect(() => {
    verifyAuthStatus();
  }, [verifyAuthStatus]);

  const login = async (email, contrasena) => {
    try {
      const response = await api.post('/auth/login', { email, contrasena });
      const { token: newToken, usuario } = response.data;
      if (!newToken || !usuario || !usuario.id || !usuario.rol) {
        console.error("Respuesta de login incompleta:", response.data);
        throw new Error("Respuesta del servidor inválida durante el inicio de sesión.");
      }
      setToken(newToken); // Esto disparará el useEffect para guardar en localStorage y header
      setUser(usuario);
      localStorage.setItem('authUser', JSON.stringify(usuario)); // Guardar datos del usuario
      return true;
    } catch (error) {
      console.error("Error en login:", error.response?.data?.message || error.message);
      // Limpiar en caso de error
      setToken(null); // Esto limpiará localStorage y header
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return true;
    } catch (error) {
      console.error("Error en registro:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); // Esto limpiará localStorage, user y header de Axios via useEffect
    // api.post('/auth/logout').catch(err => console.error("Error en logout API:", err));
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user && !!token, // Más robusto: se considera logueado si hay user Y token
    isAdmin: user?.rol?.toLowerCase() === 'admin',
    loading, // Estado de carga inicial
    login,
    register,
    logout,
    verifyAuthStatus // Exponer para re-verificar si es necesario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { // Es mejor verificar contra undefined
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};


