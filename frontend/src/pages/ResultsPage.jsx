// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../services/api'; // Asumiendo que podrías querer cargar más detalles del historial
import LoadingSpinner from '../components/ui/LoadingSpinner';
import './ResultsPage.css';

function ResultsPage() {
  const { id_historial } = useParams();
  const location = useLocation(); // Para obtener el puntaje pasado desde TestPage
  const [puntaje, setPuntaje] = useState(location.state?.puntaje);
  const [historialDetalle, setHistorialDetalle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insigniasNuevas, setInsigniasNuevas] = useState(location.state?.insigniasNuevas || []); // Si se pasan

  useEffect(() => {
    // Si el puntaje no se pasó por estado, o si queremos más detalles, cargamos el historial.
    // Por ahora, asumimos que el puntaje es suficiente si viene del estado.
    // Si no, se podría hacer una llamada a /api/historial/:id_historial para obtenerlo.
    if (puntaje === undefined) {
        const fetchHistorial = async () => {
            try {
                // Esta llamada es para obtener el puntaje si no se pasó
                // O para obtener otros detalles del test como el nombre, etc.
                const response = await api.get(`/historial`); // Endpoint que devuelve el historial del usuario
                const currentTestResult = response.data.find(h => h.id_historial === parseInt(id_historial));
                if (currentTestResult) {
                    setPuntaje(currentTestResult.puntaje);
                    setHistorialDetalle(currentTestResult); // Guardar más detalles si es necesario
                } else {
                    console.error("No se encontró el resultado del test en el historial.");
                    // Manejar error, quizás redirigir o mostrar mensaje
                }
            } catch (error) {
                console.error("Error cargando detalles del resultado:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistorial();
    } else {
        setIsLoading(false); // Ya tenemos el puntaje
    }
  }, [id_historial, puntaje]);


  const getResultMessage = () => {
    if (puntaje === undefined || puntaje === null) return "Calculando tu resultado...";
    if (puntaje >= 80) return "¡Excelente! Eres un experto en la cultura boliviana.";
    if (puntaje >= 60) return "¡Muy bien! Tienes un gran conocimiento.";
    if (puntaje >= 40) return "¡Buen intento! Sigue aprendiendo y mejorando.";
    return "Sigue esforzándote. ¡Cada test es una oportunidad para aprender más!";
  };

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando resultados..." /></div>;
  }

  return (
    <div className="results-page container fade-in card">
      <header className="results-header">
        <h1><span role="img" aria-label="confeti" className="icon">🎉</span> ¡Test Completado! <span role="img" aria-label="confeti" className="icon">🎉</span></h1>
      </header>

      <section className="score-section">
        <p className="your-score-label">Tu Puntaje Final:</p>
        <p className="score-value">{puntaje !== undefined ? `${puntaje} puntos` : 'N/A'}</p>
        <p className="score-message">{getResultMessage()}</p>
      </section>

      {insigniasNuevas && insigniasNuevas.length > 0 && (
        <section className="new-badges-section">
          <h2><span role="img" aria-label="medalla" className="icon">🏅</span> ¡Nuevas Insignias Desbloqueadas!</h2>
          <ul className="badges-list">
            {insigniasNuevas.map(insignia => (
              <li key={insignia.id} className="badge-item">
                {/* Podrías tener un icono para cada insignia */}
                <strong>{insignia.nombre}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="results-actions">
        <Link to={`/revision/${id_historial}`} className="button button-secondary">
          <span role="img" aria-label="revisar" className="icon">🧐</span> Revisar Respuestas
        </Link>
        <Link to="/tests" className="button button-primary">
          <span role="img" aria-label="otro test" className="icon">🔁</span> Jugar Otro Test
        </Link>
        <Link to="/rankings" className="button button-secondary">
          <span role="img" aria-label="rankings" className="icon">🏆</span> Ver Rankings
        </Link>
      </nav>
      {/* TODO: Añadir botones para compartir en redes sociales */}
    </div>
  );
}

export default ResultsPage;
