// src/pages/TestPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './TestPage.css'; // CSS específico

function TestPage() {
  const { id_test } = useParams();
  const navigate = useNavigate();
  const [testInfo, setTestInfo] = useState(null); // Para nombre del test, etc.
  const [preguntas, setPreguntas] = useState([]);
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState({}); // { id_pregunta: id_respuesta_seleccionada } o { id_pregunta: "texto" }
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [startTime, setStartTime] = useState(null); // Para calcular duración

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchTestPreguntas = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      // Obtener info del test (nombre, etc.)
      const testDetailsRes = await api.get(`/tests/${id_test}`);
      setTestInfo(testDetailsRes.data);

      // Obtener preguntas del test
      const preguntasRes = await api.get(`/preguntas/test/${id_test}`);
      setPreguntas(preguntasRes.data || []); // Asegurar que sea un array
      setStartTime(Date.now()); // Iniciar contador de tiempo
    } catch (err) {
      console.error("Error cargando el test:", err);
      setNotification({ message: 'Error al cargar las preguntas del test. Intenta de nuevo.', type: 'error' });
      setPreguntas([]);
    } finally {
      setIsLoading(false);
    }
  }, [id_test]);

  useEffect(() => {
    fetchTestPreguntas();
  }, [fetchTestPreguntas]);

  const handleRespuestaSeleccionada = (id_pregunta, id_respuesta, tipoPregunta) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [id_pregunta]: tipoPregunta === 'Abierta' ? id_respuesta : parseInt(id_respuesta, 10) // id_respuesta es el texto para abiertas
    }));
  };

  const goToNextPregunta = () => {
    if (currentPreguntaIndex < preguntas.length - 1) {
      setCurrentPreguntaIndex(prev => prev + 1);
    }
  };

  const goToPrevPregunta = () => {
    if (currentPreguntaIndex > 0) {
      setCurrentPreguntaIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    const confirmSubmit = window.confirm("¿Estás seguro de que quieres finalizar y enviar tus respuestas?");
    if (!confirmSubmit) return;

    setIsSubmitting(true);
    handleNotificationClose();
    const duracion_segundos = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    // Formatear respuestas para el backend
    const respuestasParaEnviar = Object.entries(respuestasUsuario).map(([id_pregunta, respuesta]) => {
        const preguntaActual = preguntas.find(p => p.id_pregunta === parseInt(id_pregunta));
        if (preguntaActual?.tipoPregunta === 'Abierta') {
            return { id_pregunta: parseInt(id_pregunta), texto_respuesta: respuesta };
        }
        return { id_pregunta: parseInt(id_pregunta), id_respuesta_seleccionada: respuesta };
    });


    try {
      const response = await api.post('/respuestas/submit', {
        id_test: parseInt(id_test, 10),
        respuestas_usuario: respuestasParaEnviar,
        duracion_segundos
      });
      // Redirigir a la página de resultados con el id_historial
      navigate(`/resultados/${response.data.id_historial}`, { state: { fromTest: true, puntaje: response.data.puntaje } });
    } catch (err) {
      console.error("Error enviando respuestas:", err);
      setNotification({ message: err.response?.data?.message || 'Error al enviar tus respuestas. Intenta de nuevo.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando test..." /></div>;
  }

  if (!preguntas || preguntas.length === 0) {
    return (
      <div className="test-page container">
        <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
        <p className="error-message">No se encontraron preguntas para este test o hubo un error al cargarlas.</p>
        <Link to="/tests" className="button button-secondary">Volver a la lista de tests</Link>
      </div>
    );
  }

  const preguntaActual = preguntas[currentPreguntaIndex];

  return (
    <div className="test-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="test-header">
        <h2>{testInfo?.nombre || `Test #${id_test}`}</h2>
        <p className="pregunta-counter">Pregunta {currentPreguntaIndex + 1} de {preguntas.length}</p>
      </header>

      <section className="pregunta-container card">
        <h3 className="pregunta-texto">{preguntaActual.textoPregunta}</h3>
        <div className="opciones-respuesta">
          {preguntaActual.tipoPregunta === 'Abierta' ? (
            <textarea
              className="form-textarea respuesta-abierta"
              placeholder="Escribe tu respuesta aquí..."
              value={respuestasUsuario[preguntaActual.id_pregunta] || ''}
              onChange={(e) => handleRespuestaSeleccionada(preguntaActual.id_pregunta, e.target.value, preguntaActual.tipoPregunta)}
              rows="4"
            />
          ) : (
            preguntaActual.respuestas?.map(opcion => (
              <label
                key={opcion.id_respuesta}
                className={`opcion-label ${respuestasUsuario[preguntaActual.id_pregunta] === opcion.id_respuesta ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`pregunta_${preguntaActual.id_pregunta}`}
                  value={opcion.id_respuesta}
                  checked={respuestasUsuario[preguntaActual.id_pregunta] === opcion.id_respuesta}
                  onChange={() => handleRespuestaSeleccionada(preguntaActual.id_pregunta, opcion.id_respuesta, preguntaActual.tipoPregunta)}
                  className="sr-only" // Ocultar radio original, el label es clickeable
                />
                {opcion.texto}
              </label>
            ))
          )}
          {(!preguntaActual.respuestas || preguntaActual.respuestas.length === 0) && preguntaActual.tipoPregunta !== 'Abierta' && (
            <p className="no-options-message">Esta pregunta no tiene opciones de respuesta configuradas.</p>
          )}
        </div>
      </section>

      <nav className="test-navigation">
        <button
          onClick={goToPrevPregunta}
          disabled={currentPreguntaIndex === 0 || isSubmitting}
          className="button button-secondary"
        >
          <span role="img" aria-label="anterior" className="icon">⬅️</span> Anterior
        </button>
        {currentPreguntaIndex === preguntas.length - 1 ? (
          <button
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="button button-primary button-submit-test"
          >
            {isSubmitting ? <LoadingSpinner size="small" text=""/> : <><span role="img" aria-label="finalizar" className="icon">🏁</span> Finalizar Test</>}
          </button>
        ) : (
          <button
            onClick={goToNextPregunta}
            disabled={currentPreguntaIndex === preguntas.length - 1 || isSubmitting}
            className="button button-primary"
          >
            Siguiente <span role="img" aria-label="siguiente" className="icon">➡️</span>
          </button>
        )}
      </nav>
    </div>
  );
}

export default TestPage;
