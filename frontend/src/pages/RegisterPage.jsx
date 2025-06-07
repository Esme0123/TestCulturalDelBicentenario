// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css'; // Reutilizar estilos de formulario
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth(); // Asumiendo que tienes una función 'register' en AuthContext
  const navigate = useNavigate();

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleNotificationClose();

    if (formData.contrasena !== formData.confirmarContrasena) {
      setNotification({ message: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }
    if (formData.contrasena.length < 6) {
      setNotification({ message: 'La contraseña debe tener al menos 6 caracteres.', type: 'error'});
      return;
    }

    setIsLoading(true);
    try {
      // Excluir confirmarContrasena del objeto enviado al backend
      // eslint-disable-next-line no-unused-vars
      const { confirmarContrasena, ...userData } = formData;
      const success = await register(userData); // Llama a la función de registro del AuthContext

      if (success) {
        setNotification({ message: '¡Registro exitoso! Ahora puedes iniciar sesión.', type: 'success' });
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirigir a login después de 2 segundos
      }
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Error en el registro. Inténtalo de nuevo.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleNotificationClose}
      />
      <div className="form-container-wrapper">
        <div className="form-container">
          <h2 className="form-title">Crear Cuenta</h2>
          <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" name="nombre" id="nombre" required value={formData.nombre} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno</label>
              <input type="text" name="apellidoPaterno" id="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno</label>
              <input type="text" name="apellidoMaterno" id="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">Contraseña (mín. 6 caracteres)</label>
              <input type="password" name="contrasena" id="contrasena" required value={formData.contrasena} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
              <input type="password" name="confirmarContrasena" id="confirmarContrasena" required value={formData.confirmarContrasena} onChange={handleChange} className="form-input" disabled={isLoading} />
            </div>
            <div className="form-group">
              <button type="submit" disabled={isLoading} className="button button-primary button-full-width">
                {isLoading ? <LoadingSpinner size="small" text="" /> : 'Registrarse'}
              </button>
            </div>
          </form>
          <p className="form-footer-link text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
