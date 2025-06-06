// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './ProfilePage.css'; // CSS específico

function ProfilePage() {
  const { user } = useAuth(); // Obtener info del usuario logueado
  const [estadisticas, setEstadisticas] = useState([]);
  const [misInsignias, setMisInsignias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    handleNotificationClose();
    try {
      const [statsRes, insigniasRes] = await Promise.all([
        api.get('/historial/estadisticas'),
        api.get('/insignias/mis-insignias')
      ]);
      setEstadisticas(statsRes.data || []);
      setMisInsignias(insigniasRes.data || []);
    } catch (err) {
      console.error("Error cargando datos del perfil:", err);
      setNotification({ message: 'No se pudo cargar la información de tu perfil.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando perfil..." /></div>;
  }

  if (!user) {
    return (
      <div className="profile-page container fade-in card">
        <p className="error-message">Debes iniciar sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="profile-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header profile-header">
        <h1><span role="img" aria-label="perfil" className="icon">👤</span> Mi Perfil</h1>
        <div className="user-info card">
          <h2>{user.nombre} {user.apellidoPaterno} {user.apellidoMaterno || ''}</h2>
          <p className="user-email"><span role="img" aria-label="email" className="icon-inline">📧</span> {user.email}</p>
          <p className="user-role"><span role="img" aria-label="rol" className="icon-inline">🛡️</span> Rol: <span className="role-badge">{user.rol}</span></p>
          {/* Podrías añadir "Miembro desde: [fecha_registro]" si la tienes */}
        </div>
      </header>

      <section className="profile-section card">
        <h2><span role="img" aria-label="estadisticas" className="icon-inline">📊</span> Mis Estadísticas por Categoría</h2>
        {estadisticas.length > 0 ? (
          <ul className="stats-list">
            {estadisticas.map(stat => (
              <li key={stat.id_categoria} className="stat-item">
                <span className="stat-category">{stat.categoria_nombre}</span>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${stat.porcentaje_aciertos || 0}%` }}
                    title={`${(Number(stat.porcentaje_aciertos) || 0).toFixed(1)}%`}
                  >
                    {(Number(stat.porcentaje_aciertos) || 0).toFixed(1)}%
                  </div>
                </div>
                <span className="stat-details">({Number(stat.respuestas_correctas)} / {Number(stat.preguntas_totales)} correctas)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data-message">Aún no tienes estadísticas. ¡Completa algunos tests!</p>
        )}
      </section>

      <section className="profile-section card">
        <h2><span role="img" aria-label="insignias" className="icon-inline">🏅</span> Mis Insignias</h2>
        {misInsignias.length > 0 ? (
          <div className="insignias-grid">
            {misInsignias.map(insignia => (
              <div key={insignia.id_insignia} className="insignia-item" title={`${insignia.nombre}: ${insignia.descripcion} (Obtenida: ${new Date(insignia.fecha_obtenida).toLocaleDateString()})`}>
                {/* Idealmente, aquí iría una imagen o un icono SVG para la insignia */}
                {insignia.icono_url ? (
                  <img src={insignia.icono_url} alt={insignia.nombre} className="insignia-icon-img" onError={(e) => e.target.style.display='none'}/>
                ) : (
                  <span className="insignia-icon-placeholder" role="img" aria-label="insignia">🏆</span>
                )}
                <p className="insignia-nombre">{insignia.nombre}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">Aún no has ganado ninguna insignia. ¡Sigue participando!</p>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
