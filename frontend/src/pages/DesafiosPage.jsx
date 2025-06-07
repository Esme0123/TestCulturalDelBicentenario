// src/pages/DesafiosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from "socket.io-client"; 
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './DesafiosPage.css'; // CSS específico
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL, { autoConnect: false });
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
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const fetchDesafios = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [recibidosRes, enviadosRes] = await Promise.all([
                api.get('/desafios/recibidos'),
                api.get('/desafios/enviados')
            ]);
            setDesafiosRecibidos(recibidosRes.data);
            setMisDesafiosCreados(enviadosRes.data);
        } catch (err) {
            setError('No se pudieron cargar los desafíos.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDesafios();
    }, [fetchDesafios]);


    // --- 2. EFECTO PARA ESCUCHAR EVENTOS DE SOCKET ---
    useEffect(() => {
        // Solo nos conectamos si hay un usuario logueado.
        if (!user?.id) return;

        socket.connect();
        console.log("Socket intentando conectar...");

        // Definimos la función que manejará el evento
        const handleDesafioActualizado = (data) => {
            const { id_desafio, nuevo_estado, id_creador } = data;
            console.log(`Evento de socket recibido:`, data);
            if (nuevo_estado === 'EN PROGRESO' && id_creador === user.id) {
                // ¡Aceptaron mi reto! Muestro notificación y redirijo.
                setNotification({ message: '¡Tu desafío fue aceptado! Entrando a la partida...', type: 'success' });
                setTimeout(() => navigate(`/challenge/${id_desafio}`), 1500);
            } else {
                fetchDesafios();
            }
        };

        // Nos suscribimos al evento del servidor.
        socket.on('desafio_actualizado', handleDesafioActualizado);

        return () => {
            console.log("Socket desconectando...");
            socket.off('desafio_actualizado', handleDesafioActualizado);
            socket.disconnect();
        };
    }, [user, navigate, fetchDesafios]);


    // --- Handlers de Acciones ---
    const handleAcceptDesafio = async (desafioId) => {
        setNotification({ message: '', type: '' });
        try {
            // AHORA LLAMA A LA RUTA CORRECTA CON PUT
            await api.put(`/desafios/${desafioId}/aceptar`);
            setNotification({ message: '¡Desafío aceptado! Redirigiendo a la partida...', type: 'success' });

            setTimeout(() => {
                navigate(`/challenge/${desafioId}`);
            }, 1500);

        } catch (err) {
            console.error("Error al aceptar el desafío:", err);
            setNotification({ message: err.response?.data?.message || 'Error al aceptar el desafío.', type: 'error' });
        }
    };

    const handleRejectDesafio = async (desafioId) => {
        try {
            await api.put(`/desafios/${desafioId}/rechazar`);
            setNotification({ message: 'Desafío rechazado.', type: 'info' });
            fetchDesafios(); // Recarga para que desaparezca de la lista
        } catch (err) {
            console.error("Error al rechazar el desafío:", err);
            setNotification({ message: 'Error al rechazar el desafío.', type: 'error' });
        }
    };
    
    // El resto del componente (handleOpenCreateModal, JSX de renderizado) se mantiene igual...
    const handleOpenCreateModal = async () => {
        try {
            // Nota: La ruta /usuarios debe existir en alguna parte de tus rutas de backend
            const [testsRes, usersRes] = await Promise.all([
                api.get('/tests?basic=true'),
                api.get('/usuarios')
            ]);
            setTestsParaDesafio(testsRes.data);
            setUsuariosParaRetar(usersRes.data.filter(u => u.id_usuario !== user.id));
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error preparando modal:", err);
            setNotification({ message: 'No se pudo cargar la información para crear desafíos.', type: 'error' });
        }
    };
    
    const handleCreateDesafio = async (data) => {
        try {
            await api.post('/desafios', data);
            setNotification({ message: '¡Desafío enviado con éxito!', type: 'success'});
            setIsModalOpen(false);
            fetchDesafios();
        } catch (err) {
            console.error("Error al crear desafío:", err);
            setNotification({ message: err.response?.data?.message || 'Error al crear el desafío.', type: 'error' });
        }
    }

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="desafios-page">
            {notification.message && <Notification message={notification.message} type={notification.type} />}
            <div className="page-header">
                <h1><span role="img" aria-label="espadas cruzadas" className="icon">⚔️</span> Mis Desafíos</h1>
                <button onClick={handleOpenCreateModal} className="create-desafio-button">
                  <span role="img" aria-label="nuevo desafío" className="icon">➕</span> Crear Nuevo Desafío
                </button>
            </div>
            <section className="desafios-section card">
                <h2>Desafíos Recibidos</h2>
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
                                    <p><strong>Estado:</strong> <span className={`status-badge status-pending`}>{d.nombre_estado}</span></p>
                                </div>
                                <div className="desafio-actions">
                                    <button onClick={() => handleAcceptDesafio(d.id_desafio)} className="button button-success">Aceptar</button>
                                    <button onClick={() => handleRejectDesafio(d.id_desafio)} className="button button-danger">Rechazar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-data-message">No tienes desafíos pendientes de aceptar.</p>
                )}
            </section>
            <section className="desafios-section card">
                <h2>Mis Desafíos Enviados</h2>
                 {misDesafiosCreados.length > 0 ? (
                    <ul className="desafios-list">
                        {misDesafiosCreados.map(d => (
                            <li key={d.id_desafio} className="desafio-item">
                                <div className="desafio-info">
                                    <p><strong>Retado:</strong> {d.retado_nombre}</p>
                                    <p><strong>Test:</strong> {d.test_nombre}</p>
                                    <p><strong>Estado:</strong> <span className={`status-badge status-${d.nombre_estado?.toLowerCase().replace(' ', '-')}`}>{d.nombre_estado}</span></p>
                                    <p><strong>Fecha:</strong> {new Date(d.fecha_inicio).toLocaleDateString()}</p>
                                </div>
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
                onSubmit={handleCreateDesafio}
            />
        </div>
    );
}

export default DesafiosPage;
