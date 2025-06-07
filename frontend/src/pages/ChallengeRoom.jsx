// src/pages/ChallengeRoom.jsx (Refactorizado con botón de Finalizar)
import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Notification from '../components/ui/Notification'; // Para mostrar notificaciones

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL, {
    autoConnect: false, 
});

function ChallengeRoom() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const userId = user?.id;
    const navigate = useNavigate();

    // --- State Management ---
    const [isConnected, setIsConnected] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [isLastQuestionAnswered, setIsLastQuestionAnswered] = useState(false); // <-- NUEVO ESTADO
    
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
    
    const [roomState, setRoomState] = useState({ players: [], scores: {} });
    const [finalResults, setFinalResults] = useState(null);
    const [myAnswers, setMyAnswers] = useState([]);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    // --- Memoized Values ---
    const preguntaActual = useMemo(() => preguntas[preguntaActualIndex] || null, [preguntas, preguntaActualIndex]);
    const myScore = roomState.scores[userId] || 0;

    // --- Efecto Principal para Conexión y Eventos de Socket ---
    useEffect(() => {
        if (!userId || !roomId) return;
        socket.connect();

        const onConnect = () => { setIsConnected(true); socket.emit('joinChallenge', { roomId, userId }); };
        const onDisconnect = () => setIsConnected(false);
        const onRoomStateUpdate = (newState) => setRoomState(prevState => ({ ...prevState, ...newState }));
        const onStartChallenge = (data) => { console.log(data.message); setGameStarted(true); };
        const onChallengeFinished = (results) => { console.log('El desafío ha finalizado:', results); setGameFinished(true); setFinalResults(results); };
        const onOpponentLeft = (data) => { console.warn(data.message); setError('Tu oponente ha abandonado la partida.'); };
        const onErrorMessage = (message) => { console.error('Error desde el servidor:', message); setError(message); };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('roomStateUpdate', onRoomStateUpdate);
        socket.on('startChallenge', onStartChallenge);
        socket.on('challengeFinished', onChallengeFinished);
        socket.on('opponentLeft', onOpponentLeft);
        socket.on('errorMessage', onErrorMessage);

        api.get(`/desafios/${roomId}/preguntas`)
            .then(res => setPreguntas(res.data))
            .catch(err => {
                console.error("Error al cargar las preguntas:", err);
                setError("No se pudieron cargar las preguntas del desafío.");
            });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('roomStateUpdate', onRoomStateUpdate);
            socket.off('startChallenge', onStartChallenge);
            socket.off('challengeFinished', onChallengeFinished);
            socket.off('opponentLeft', onOpponentLeft);
            socket.off('errorMessage', onErrorMessage);
            socket.disconnect();
        };
    }, [roomId, userId]);

    // --- Handlers de Acciones ---
    const enviarRespuesta = (id_respuesta) => {
        if (!preguntaActual) return;
        setMyAnswers(prev => [...prev, { 
            id_pregunta: preguntaActual.id_pregunta, 
            id_respuesta: id_respuesta 
        }]);
        socket.emit('sendAnswer', {
            roomId,
            userId,
            questionId: preguntaActual.id_pregunta,
            answer: id_respuesta,
        });

        if (preguntaActualIndex < preguntas.length - 1) {
            setPreguntaActualIndex(prev => prev + 1);
        } else {
            setIsLastQuestionAnswered(true);
        }
    };
    
    // Se llama al pulsar el nuevo botón "Finalizar Desafío"
    const handleFinalizarDesafio = async () => {
        setNotification({ message: 'Guardando tu resultado...', type: 'info' });
        try {
            // 1. Llama al endpoint del backend para guardar el resultado en el historial
            await api.post('/desafios/finalizar', {
                id_desafio: roomId,
                puntaje: myScore,
                respuestas: myAnswers 
            });

            // 2. Emite el evento al socket para notificar al servidor que este jugador ha terminado
            socket.emit('finishChallenge', { roomId, userId });

            setNotification({ message: '¡Resultado guardado! Esperando a tu oponente...', type: 'success' });

        } catch (err) {
            console.error("Error al finalizar el desafío:", err);
            setError(err.response?.data?.message || "No se pudo guardar tu resultado en el historial.");
        }
    };

    // --- Renderizado del Componente ---
    if (!user) return <Navigate to="/login" replace />;
    if (error) return <div className="error-container card"><h2>Error</h2><p>{error}</p></div>
    if (notification.message) return <Notification message={notification.message} type={notification.type} onClose={() => setNotification({message: '', type: ''})}/>

    if (gameFinished && finalResults) {
        const { scores, winnerId } = finalResults;
        const isWinner = winnerId === userId;
        return (
            <div className="results-container card" style={{textAlign: 'center', padding: '2rem'}}>
                <h2>Desafío Finalizado</h2>
                {winnerId ? (
                    <h3>{isWinner ? "¡Felicidades, ganaste!" : `Perdiste. El ganador es el usuario ${winnerId}`}</h3>
                ) : (
                    <h3>¡Es un empate!</h3>
                )}
                <h4>Puntajes Finales:</h4>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {Object.entries(scores).map(([uid, score]) => (
                        <li key={uid}>Usuario {uid}: {score} puntos</li>
                    ))}
                </ul>
                <button onClick={() => navigate('/desafios')} className="button button-primary" style={{marginTop: '1rem'}}>Volver a Desafíos</button>
            </div>
        )
    }

    if (!isConnected) return <div>Conectando a la sala de desafío...</div>;

    if (!gameStarted) {
        return (
            <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
                <h2>Sala de Desafío: {roomId}</h2>
                <p>Esperando a tu oponente...</p>
                <p>Jugadores en la sala: {roomState.players.join(', ')}</p>
            </div>
        );
    }
    
    // Pantalla intermedia después de responder la última pregunta
    if (isLastQuestionAnswered) {
        return (
            <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
                <h2>Has completado todas las preguntas</h2>
                <p>Tu puntaje actual es: <strong>{myScore}</strong></p>
                <p>Presiona el botón para guardar tu resultado y finalizar el desafío.</p>
                <button onClick={handleFinalizarDesafio} className="button button-success" style={{marginTop: '1rem', padding: '10px 20px', fontSize: '1rem'}}>
                    Finalizar Desafío
                </button>
            </div>
        );
    }

    if (!preguntaActual) return <div>Cargando preguntas...</div>;

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2>Desafío en curso - Sala: {roomId}</h2>
            <div>
                <p><strong>Tu puntaje:</strong> {myScore}</p>
                {Object.entries(roomState.scores).map(([uid, score]) => (
                    uid != userId && <p key={uid}><strong>Puntaje Oponente ({uid}):</strong> {score}</p>
                ))}
            </div>
            <hr/>
            <div style={{ margin: '20px 0' }}>
                <h3>Pregunta {preguntaActualIndex + 1} de {preguntas.length}:</h3>
                <p>{preguntaActual.textoPregunta}</p>
                <div>
                    {preguntaActual.respuestas.map((r) => (
                        <button
                            key={r.id_respuesta}
                            onClick={() => enviarRespuesta(r.id_respuesta)}
                            className="button"
                            style={{ margin: '5px' }}
                        >
                            {r.texto}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChallengeRoom;
