// src/pages/RankingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './RankingsPage.css';

function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [tipoRanking, setTipoRanking] = useState('general'); // 'general', 'semanal', 'mensual'
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchRankings = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      const response = await api.get('/rankings', {
        params: { tipo: tipoRanking, limit: 10 } // Obtener top 10
      });
      setRankings(response.data);
    } catch (err) {
      console.error(`Error cargando ranking ${tipoRanking}:`, err);
      setNotification({ message: `No se pudo cargar el ranking ${tipoRanking}.`, type: 'error' });
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  }, [tipoRanking]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const getMedal = (index) => {
    if (index === 0) return <span role="img" aria-label="Medalla de oro" className="medal gold">🥇</span>;
    if (index === 1) return <span role="img" aria-label="Medalla de plata" className="medal silver">🥈</span>;
    if (index === 2) return <span role="img" aria-label="Medalla de bronce" className="medal bronze">🥉</span>;
    return <span className="rank-number">{index + 1}</span>;
  };

  return (
    <div className="rankings-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header">
        <h1><span role="img" aria-label="trofeo" className="icon">🏆</span> Salón de la Fama</h1>
        <p>¡Descubre quiénes son los mejores en el Test Cultural del Bicentenario!</p>
      </header>

      <div className="ranking-filters card">
        <h2 className="filters-title">Ver Ranking:</h2>
        <div className="filter-buttons">
          <button
            onClick={() => setTipoRanking('general')}
            className={`button ${tipoRanking === 'general' ? 'button-primary active' : 'button-secondary'}`}
          >
            General
          </button>
          <button
            onClick={() => setTipoRanking('mensual')}
            className={`button ${tipoRanking === 'mensual' ? 'button-primary active' : 'button-secondary'}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setTipoRanking('semanal')}
            className={`button ${tipoRanking === 'semanal' ? 'button-primary active' : 'button-secondary'}`}
          >
            Semanal
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text={`Cargando ranking ${tipoRanking}...`} />
      ) : rankings.length > 0 ? (
        <div className="ranking-table-container card">
          <h3 className="ranking-table-title">
            Top 10 - Ranking {tipoRanking.charAt(0).toUpperCase() + tipoRanking.slice(1)}
          </h3>
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Usuario</th>
                <th>Puntaje Máximo</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player, index) => (
                <tr key={player.id_user} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td data-label="Pos.">{getMedal(index)}</td>
                  <td data-label="Usuario" className="player-name">
                    {/* Podrías añadir un avatar o icono aquí */}
                    {player.nombre} {player.apellidoPaterno || ''}
                  </td>
                  <td data-label="Puntaje" className="player-score">{player.max_puntaje} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-rankings-message">
          Aún no hay suficientes datos para mostrar el ranking {tipoRanking}. ¡Sigue jugando!
        </p>
      )}
    </div>
  );
}

export default RankingsPage;
