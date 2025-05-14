// src/pages/DesafiosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './DesafiosPage.css'; // CSS específico

// Modal simple para crear desafío (puedes moverlo a ui/Modal.jsx si lo reutilizas mucho)
const CreateDesafioModal = ({ isOpen, onClose, tests, usuarios, onSubmit, isLoading }) => {
    const [idTestBase, setIdTestBase] = useState('');
    const [idUsuarioRetado, setIdUsuarioRetado] = useState('');
    const { user: currentUser } = useAuth(); // Para no retarse a sí mismo

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!idTestBase || !idUsuarioRetado) {
            alert("Por favor, selecciona un test y un usuario a retar.");
            return;
        }
        if (parseInt(idUsuarioRetado) === currentUser?.id) {
            alert("No puedes retarte a ti mismo.");
            return;
        }
        onSubmit({ id_test_base: parseInt(idTestBase), id_usuario_retado: parseInt(idUsuarioRetado) });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '500px'}}>
                <div className="modal-header">
                    <h3 className="modal-title">Crear Nuevo Desafío</h3>
                    <button onClick={onClose} className="modal-close-button" aria-label="Cerrar modal">&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="form-body form-compact">
                        <div className="form-group">
                            <label htmlFor="idTestBase" className="form-label">Selecciona un Test Base:</label>
                            <select id="idTestBase" value={idTestBase} onChange={(e) => setIdTestBase(e.target.value)} required className="form-select" disabled={isLoading}>
                                <option value="">Elige un test...</option>
                                {tests.map(test => (
                                    <option key={test.id_test} value={test.id_test}>{test.nombre} ({test.categoria_nombre} - {test.dificultad_nombre})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idUsuarioRetado" className="form-label">Selecciona un Usuario a Retar:</label>
                            <select id="idUsuarioRetado" value={idUsuarioRetado} onChange={(e) => setIdUsuarioRetado(e.target.value)} required className="form-select" disabled={isLoading}>
                                <option value="">Elige un usuario...</option>
                                {usuarios
                                    .filter(u => u.id_user !== currentUser?.id) // Filtrar al usuario actual
                                    .map(u => (
                                    <option key={u.id_user} value={u.id_user}>{u.nombre} {u.apellidoPaterno} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="button button-secondary" disabled={isLoading}>Cancelar</button>
                            <button type="submit" className="button button-primary" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner size="small" text=""/> : 'Enviar Desafío'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


function DesafiosPage() {
  const [misDesafiosCreados, setMisDesafiosCreados] = useState([]);
  const [desafiosRecibidos, setDesafiosRecibidos] = useState([]);
  const [testsParaDesafio, setTestsParaDesafio] = useState([]); // Tests públicos para usar de base
  const [usuariosParaRetar, setUsuariosParaRetar] = useState([]); // Lista de usuarios
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para creación/respuesta de desafío
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      // Asumimos que estos endpoints existen o los crearemos
      const [creadosRes, recibidosRes, testsRes, usersRes] = await Promise.all([
        api.get('/desafios/creados'), // Desafíos que yo he creado
        api.get('/desafios/pendientes'), // Desafíos que he recibido y están pendientes
        api.get('/tests?es_publico=true'), // Tests públicos para usar de base
        api.get('/admin/usuarios') // Obtener lista de usuarios (o un endpoint público si existe)
      ]);
      setMisDesafiosCreados(creadosRes.data || []);
      setDesafiosRecibidos(recibidosRes.data || []);
      setTestsParaDesafio(testsRes.data || []);
      setUsuariosParaRetar(usersRes.data || []);

    } catch (err) {
      console.error("Error cargando datos de desafíos:", err);
      setNotification({ message: 'No se pudo cargar la información de desafíos.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCrearDesafio = async (desafioData) => {
    setIsSubmitting(true);
    handleNotificationClose();
    try {
        await api.post('/desafios/crear', {
            id_test_base: desafioData.id_test_base, // Cambiado de id_test a id_test_base
            id_usuario_retado: desafioData.id_usuario_retado
        });
        setNotification({ message: '¡Desafío enviado con éxito!', type: 'success'});
        setIsModalOpen(false);
        fetchData(); // Recargar datos
    } catch (err) {
        console.error("Error creando desafío:", err);
        setNotification({ message: err.response?.data?.message || 'Error al enviar el desafío.', type: 'error'});
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleResponderDesafio = async (id_desafio, aceptar) => {
    setIsSubmitting(true);
    handleNotificationClose();
    try {
        await api.post(`/desafios/${id_desafio}/responder`, { aceptar });
        setNotification({ message: `Desafío ${aceptar ? 'aceptado' : 'rechazado'}.`, type: 'success'});
        fetchData(); // Recargar datos
    } catch (err) {
        console.error("Error respondiendo al desafío:", err);
        setNotification({ message: err.response?.data?.message || 'Error al responder al desafío.', type: 'error'});
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner size="large" text="Cargando desafíos..." /></div>;
  }

  return (
    <div className="desafios-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header">
        <h1><span role="img" aria-label="espadas cruzadas" className="icon">⚔️</span> Mis Desafíos</h1>
        <button onClick={() => setIsModalOpen(true)} className="button button-primary create-desafio-button">
            <span role="img" aria-label="nuevo desafío" className="icon">➕</span> Crear Nuevo Desafío
        </button>
      </header>

      <section className="desafios-section card">
        <h2>Desafíos Recibidos (Pendientes)</h2>
        {desafiosRecibidos.length > 0 ? (
          <ul className="desafios-list">
            {desafiosRecibidos.map(d => (
              <li key={d.id_desafio} className="desafio-item">
                <div className="desafio-info">
                  <p><strong>Retador:</strong> {d.creador_nombre || 'Desconocido'}</p>
                  <p><strong>Test:</strong> {d.test_nombre || 'Test Base'}</p>
                  <p><strong>Categoría:</strong> {d.categoria_nombre || 'N/A'}</p>
                  <p><strong>Dificultad:</strong> {d.dificultad_nombre || 'N/A'}</p>
                  <p><strong>Fecha:</strong> {new Date(d.fecha_inicio).toLocaleDateString()}</p>
                </div>
                <div className="desafio-actions">
                  <button onClick={() => handleResponderDesafio(d.id_desafio, true)} className="button button-success button-small" disabled={isSubmitting}>Aceptar</button>
                  <button onClick={() => handleResponderDesafio(d.id_desafio, false)} className="button button-danger button-small" disabled={isSubmitting}>Rechazar</button>
                  {/* Si aceptado, podría cambiar a "Jugar Ahora" */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data-message">No tienes desafíos pendientes recibidos.</p>
        )}
      </section>

      <section className="desafios-section card">
        <h2>Mis Desafíos Enviados</h2>
        {misDesafiosCreados.length > 0 ? (
          <ul className="desafios-list">
            {misDesafiosCreados.map(d => (
              <li key={d.id_desafio} className="desafio-item">
                <div className="desafio-info">
                  <p><strong>Retado:</strong> {d.retado_nombre || 'Desconocido'}</p>
                  <p><strong>Test:</strong> {d.test_nombre || 'Test Base'}</p>
                  <p><strong>Estado:</strong> <span className={`status-badge status-${d.nombre_estado?.toLowerCase().replace(' ', '-')}`}>{d.nombre_estado || 'N/A'}</span></p>
                  <p><strong>Fecha:</strong> {new Date(d.fecha_inicio).toLocaleDateString()}</p>
                  {/* Podrías mostrar puntajes si el desafío está finalizado */}
                </div>
                {/* Acciones para desafíos enviados (ej. cancelar si está pendiente) */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data-message">No has enviado ningún desafío todavía.</p>
        )}
      </section>

      <CreateDesafioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tests={testsParaDesafio}
        usuarios={usuariosParaRetar}
        onSubmit={handleCrearDesafio}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default DesafiosPage;
