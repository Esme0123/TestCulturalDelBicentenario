// src/pages/ChallengeRoom.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api'; // tu configuración axios o fetch

const socket = io('http://localhost:3000'); // Ajusta URL si backend es diferente

function ChallengeRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();

  // Si no hay usuario logueado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userId = user.id;
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [resultadoRespuesta, setResultadoRespuesta] = useState(null);

  useEffect(() => {
    async function fetchPreguntas() {
      try {
        const res = await api.get(`/desafios/${roomId}/preguntas`);
        setPreguntas(res.data);
      } catch (error) {
        console.error('Error cargando preguntas del desafío:', error);
      }
    }
    fetchPreguntas();

    socket.emit('joinChallenge', { roomId, userId });

    socket.on('playersUpdate', (playersList) => setPlayers(playersList));
    socket.on('startChallenge', (data) => {
      setMessages(msgs => [...msgs, data.message || 'El desafío comienza!']);
    });
    socket.on('challengeAccepted', (data) => {
      setMessages(msgs => [...msgs, data.message || 'El desafío fue aceptado, a jugar!']);
    });
    socket.on('opponentAnswered', ({ userId: opponentId, questionId, answer, esCorrecta }) => {
      setMessages(msgs => [...msgs, `Jugador ${opponentId} respondió pregunta ${questionId} (${esCorrecta ? 'Correcto' : 'Incorrecto'})`]);
    });
    socket.on('answerResult', ({ questionId, esCorrecta }) => {
      setResultadoRespuesta(esCorrecta);
      if (esCorrecta) setScore(s => s + 10);
      setRespondido(true);
      setTimeout(() => {
        setPreguntaActualIndex(idx => Math.min(idx + 1, preguntas.length - 1));
        setRespondido(false);
        setResultadoRespuesta(null);
      }, 1500);
    });
    socket.on('challengeFinished', ({ userId: finisherId, puntaje }) => {
      setMessages(msgs => [...msgs, `Jugador ${finisherId} terminó con puntaje ${puntaje}`]);
    });
    socket.on('errorMessage', (msg) => {
      setMessages(msgs => [...msgs, `Error: ${msg}`]);
    });

    return () => {
      socket.off('playersUpdate');
      socket.off('startChallenge');
      socket.off('challengeAccepted');
      socket.off('opponentAnswered');
      socket.off('answerResult');
      socket.off('challengeFinished');
      socket.off('errorMessage');
    };
  }, [roomId, userId, preguntas.length]);

  const preguntaActual = preguntas[preguntaActualIndex] || { textoPregunta: '', respuestas: [] };

  const enviarRespuesta = (id_respuesta) => {
    if (respondido) return; // No enviar si ya respondió
    socket.emit('sendAnswer', {
      roomId,
      userId,
      questionId: preguntaActual.id_pregunta,
      answer: id_respuesta,
    });
  };

  const finalizarDesafio = () => {
    socket.emit('finishChallenge', { roomId, userId, puntaje: score });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sala: {roomId}</h2>
      <p>Jugadores conectados: {players.length}</p>
      <p>Puntaje actual: {score}</p>

      <div style={{ margin: '20px 0' }}>
        <h3>Pregunta {preguntaActualIndex + 1}:</h3>
        <p>{preguntaActual.textoPregunta}</p>
        <div>
          {preguntaActual.respuestas.map((r) => (
            <button
              key={r.id_respuesta}
              onClick={() => enviarRespuesta(r.id_respuesta)}
              disabled={respondido}
              style={{
                margin: '5px',
                backgroundColor: respondido
                  ? (resultadoRespuesta ? 'lightgreen' : 'lightcoral')
                  : 'white',
              }}
            >
              {r.texto}
            </button>
          ))}
        </div>
      </div>

      {preguntaActualIndex === preguntas.length - 1 && (
        <button onClick={finalizarDesafio} disabled={respondido} style={{ marginTop: 20 }}>
          Finalizar Desafío
        </button>
      )}

      <div>
        <h4>Mensajes</h4>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default ChallengeRoom;
