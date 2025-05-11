import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css';
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Importar Spinner
import Notification from '../components/ui/Notification'; // Importar Notificación

function LoginPage() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  // const [error, setError] = useState(''); // Se manejará con el componente Notification
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false); // Renombrado de 'loading'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleNotificationClose(); // Limpiar notificaciones previas
    setIsLoading(true);
    try {
      const success = await login(email, contrasena);
      if (success) {
        // No necesitamos notificación de éxito aquí, la redirección es suficiente
        navigate('/');
      }
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mostrar notificación si hay mensaje */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleNotificationClose}
      />

      <div className="form-container-wrapper">
        <div className="form-container">
          <h2 className="form-title">Iniciar Sesión</h2>
          <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="form-input" placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
              <input
                id="contrasena" name="contrasena" type="password" autoComplete="current-password" required
                value={contrasena} onChange={(e) => setContrasena(e.target.value)}
                className="form-input" placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={isLoading}
                className="button button-primary button-full-width"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" text="" /> /* Spinner dentro del botón */
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
          <p className="form-footer-link text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
