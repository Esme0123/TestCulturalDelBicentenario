// src/pages/HistoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './HistoryPage.css'; 

function HistoryPage() {
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchHistorial = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      const response = await api.get('/historial');
      setHistorial(response.data || []);
    } catch (err) {
      console.error("Error cargando el historial:", err);
      setNotification({ message: 'No se pudo cargar tu historial de tests.', type: 'error' });
      setHistorial([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando historial..." /></div>;
  }

  return (
    <div className="history-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header">
        <h1><span role="img" aria-label="libro" className="icon">📜</span> Mi Historial de Tests</h1>
        <p>Aquí puedes ver todos los tests que has completado y tus resultados.</p>
      </header>

      {historial.length > 0 ? (
        <div className="history-table-container card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Nombre del Test</th>
                <th>Categoría</th>
                <th>Dificultad</th>
                <th>Fecha</th>
                <th>Puntaje</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(item => (
                <tr key={item.id_historial}>
                  <td data-label="Test">{item.test_nombre || 'Test Desconocido'}</td>
                  <td data-label="Categoría">{item.categoria_nombre || 'N/A'}</td>
                  <td data-label="Dificultad">{item.dificultad_nombre || 'N/A'}</td>
                  <td data-label="Fecha">{new Date(item.fecha).toLocaleDateString()} <span className="time">{new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td data-label="Puntaje" className="score">{item.puntaje} / {item.total_preguntas * 10}</td>
                  <td data-label="Duración">{item.duracion_segundos ? `${Math.floor(item.duracion_segundos / 60)}m ${item.duracion_segundos % 60}s` : 'N/A'}</td>
                  <td data-label="Acciones" className="actions-cell">
                    <Link to={`/revision/${item.id_historial}`} className="button button-secondary button-small">
                      Revisar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-history-message card">
          <h2>Aún no has completado ningún test.</h2>
          <p>¡Es un buen momento para empezar!</p>
          <Link to="/tests" className="button button-primary">
            <span role="img" aria-label="jugar" className="icon">📝</span> Ir a los Tests
          </Link>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
