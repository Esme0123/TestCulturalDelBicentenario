// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; 
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Notification from '../../components/ui/Notification'; 
import './AdminStyles.css';

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, tests: 0, questions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard:", error);
        setNotification({ message: 'No se pudieron cargar las estadísticas.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []); // El array vacío asegura que se ejecute solo una vez al cargar

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner text="Cargando Dashboard..." /></div>;
  }

  return (
    <div className="admin-page-container">
      {notification.message && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: ''})} />}
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard de Administración</h1>
      </header>

      <section className="dashboard-summary">
        <div className="summary-card card">
          <h3><span role="img" aria-label="usuarios" className="icon">👥</span> Usuarios Registrados</h3>
          <p className="summary-value">{stats.users}</p>
          <Link to="/admin/usuarios" className="button button-secondary button-small">Gestionar Usuarios</Link>
        </div>
        <div className="summary-card card">
          <h3><span role="img" aria-label="tests" className="icon">📝</span> Tests Creados</h3>
          <p className="summary-value">{stats.tests}</p>
          <Link to="/admin/tests" className="button button-secondary button-small">Gestionar Tests</Link>
        </div>
        <div className="summary-card card">
          <h3><span role="img" aria-label="preguntas" className="icon">❓</span> Preguntas en el Banco</h3>
          <p className="summary-value">{stats.questions}</p>
          <Link to="/admin/preguntas" className="button button-secondary button-small">Gestionar Preguntas</Link>
        </div>
      </section>

      <section className="quick-actions card">
        <h2>Acciones Rápidas</h2>
        <ul>
          <li><Link to="/admin/preguntas/nueva" className="button button-link">Añadir Nueva Pregunta</Link></li>
          <li><Link to="/admin/tests/nuevo" className="button button-link">Crear Nuevo Test Base</Link></li>
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
