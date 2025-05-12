// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import api from '../../services/api'; // Descomentar si necesitas cargar datos para el dashboard
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './AdminStyles.css'; // Estilos generales para páginas de admin

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, tests: 0, questions: 0 });
  const [isLoading, setIsLoading] = useState(false); // Cambiar a true si cargas datos

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Ejemplo: const usersRes = await api.get('/admin/stats/users');
  //       // const testsRes = await api.get('/admin/stats/tests');
  //       // const questionsRes = await api.get('/admin/stats/questions');
  //       // setStats({
  //       //   users: usersRes.data.count,
  //       //   tests: testsRes.data.count,
  //       //   questions: questionsRes.data.count,
  //       // });
  //       // Simulación de datos:
  //       setStats({ users: 150, tests: 25, questions: 300 });
  //     } catch (error) {
  //       console.error("Error cargando estadísticas del dashboard:", error);
  //       // Manejar error, quizás con una notificación
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchStats();
  // }, []);

  if (isLoading) {
    return <div className="page-loading-container"><LoadingSpinner text="Cargando Dashboard..." /></div>;
  }

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard de Administración</h1>
      </header>

      <section className="dashboard-summary">
        <div className="summary-card card">
          <h3><span role="img" aria-label="usuarios" className="icon">👥</span> Usuarios Registrados</h3>
          <p className="summary-value">{stats.users || 'N/A'}</p>
          <Link to="/admin/usuarios" className="button button-secondary button-small">Gestionar Usuarios</Link>
        </div>
        <div className="summary-card card">
          <h3><span role="img" aria-label="tests" className="icon">📝</span> Tests Creados</h3>
          <p className="summary-value">{stats.tests || 'N/A'}</p>
          <Link to="/admin/tests" className="button button-secondary button-small">Gestionar Tests</Link>
        </div>
        <div className="summary-card card">
          <h3><span role="img" aria-label="preguntas" className="icon">❓</span> Preguntas en el Banco</h3>
          <p className="summary-value">{stats.questions || 'N/A'}</p>
          <Link to="/admin/preguntas" className="button button-secondary button-small">Gestionar Preguntas</Link>
        </div>
        {/* Añadir más tarjetas de resumen si es necesario */}
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
