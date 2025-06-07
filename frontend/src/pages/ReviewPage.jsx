// src/pages/ReviewPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './ReviewPage.css'; 

function ReviewPage() {
  const { id_historial } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [historialInfo, setHistorialInfo] = useState(null); // Para nombre del test, puntaje, etc.
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchReviewData = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      const historialRes = await api.get(`/historial`); 
      const currentHistorial = historialRes.data.find(h => h.id_historial === parseInt(id_historial));
      
      if (!currentHistorial) {
        throw new Error("No se encontró el historial del test.");
      }
      setHistorialInfo(currentHistorial);

      // Luego, obtener el detalle de las respuestas para este historial
      const response = await api.get(`/historial/detalle/${id_historial}`);
      setReviewData(response.data || []);
    } catch (err) {
      console.error("Error cargando datos de revisión:", err);
      setNotification({ message: err.message || 'Error al cargar la revisión del test.', type: 'error' });
      setReviewData([]);
    } finally {
      setIsLoading(false);
    }
  }, [id_historial]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando revisión..." /></div>;
  }

  if (!reviewData || reviewData.length === 0) {
    return (
      <div className="review-page container">
        <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
        <p className="error-message">
          No se encontraron datos para esta revisión o el historial no existe.
        </p>
        <Link to="/historial" className="button button-secondary">Volver al Historial</Link>
      </div>
    );
  }

  return (
    <div className="review-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header review-header">
        <h1><span role="img" aria-label="lupa" className="icon">🧐</span> Revisión del Test</h1>
        {historialInfo && (
          <>
            <h2>{historialInfo.test_nombre}</h2>
            <p className="review-summary">
              Fecha: {new Date(historialInfo.fecha).toLocaleDateString()} | Puntaje: {historialInfo.puntaje} / {historialInfo.total_preguntas * 10} {/* Asumiendo 10 pts por pregunta */}
            </p>
          </>
        )}
      </header>

      <div className="review-questions-list">
        {reviewData.map((item, index) => (
          <div key={item.id_pregunta || index} className={`review-question-item card ${item.es_correcta ? 'correcta' : 'incorrecta'}`}>
            <div className="question-header">
              <span className="question-number">Pregunta {index + 1}</span>
              <span className={`status-badge ${item.es_correcta ? 'status-correcta' : 'status-incorrecta'}`}>
                {item.es_correcta ? 'Correcta ✔️' : 'Incorrecta ❌'}
              </span>
            </div>
            <p className="question-text-review">{item.textoPregunta}</p>

            <div className="answer-section">
              <p className="answer-label">Tu respuesta:</p>
              <p className="user-answer">
                {item.tipoPregunta === 'Abierta'
                  ? (item.texto_respuesta_abierta || <span className="no-answer">No respondida</span>)
                  : (item.texto_respuesta_seleccionada || <span className="no-answer">No respondida</span>)
                }
              </p>
            </div>

            {!item.es_correcta && item.tipoPregunta !== 'Abierta' && (
              <div className="answer-section correct-answer-section">
                <p className="answer-label">Respuesta(s) correcta(s):</p>
                <p className="correct-answer">{item.texto_respuestas_correctas || 'No disponible'}</p>
              </div>
            )}

            {item.explicacion && (
              <div className="explanation-section">
                <p className="answer-label">Explicación:</p>
                <p className="explanation-text">{item.explicacion}</p>
              </div>
            )}

            {item.lecturas_videos_asociados && (
              <div className="resources-section">
                <p className="answer-label">Recursos Adicionales:</p>
                <ul className="resources-list">
                  {item.lecturas_videos_asociados.split('; ').map((resource, rIndex) => (
                    <li key={rIndex}>
                      {(() => {
                        const parts = resource.match(/(.*) \((.*)\): (.*)/);
                        if (parts && parts.length === 4) {
                          const title = parts[1];
                          const type = parts[2];
                          const url = parts[3];
                          return <a href={url} target="_blank" rel="noopener noreferrer">{title} ({type}) <span role="img" aria-label="enlace externo">🔗</span></a>;
                        }
                        return resource; // Fallback si el formato no coincide
                      })()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="review-actions">
        <Link to="/historial" className="button button-secondary">
          <span role="img" aria-label="volver" className="icon">⏪</span> Volver al Historial
        </Link>
        <Link to="/tests" className="button button-primary">
          <span role="img" aria-label="otro test" className="icon">🔁</span> Jugar Otro Test
        </Link>
      </div>
    </div>
  );
}

export default ReviewPage;
