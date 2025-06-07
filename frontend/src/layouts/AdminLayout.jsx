// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css'; 

function AdminLayout() {
  const { user, logout } = useAuth();

  const activeAdminLink = "admin-nav-link active";
  const inactiveAdminLink = "admin-nav-link";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="brand-logo">
            <span role="img" aria-label="panel admin" style={{ marginRight: '0.5rem' }}>⚙️</span>
            Admin Panel
          </Link>
        </div>
        <nav>
          <ul>
            {/*<li>
              <NavLink to="/admin/stats" className={({isActive}) => isActive ? activeAdminLink : inactiveAdminLink}>
                {/* Icono para Dashboard 
                <span role="img" aria-label="dashboard" className="icon">📊</span> Dashboard
              </NavLink>
            </li>*/}
            <li>
              <NavLink to="/admin/preguntas" className={({isActive}) => isActive ? activeAdminLink : inactiveAdminLink}>
                {/* Icono para Preguntas */}
                <span role="img" aria-label="preguntas" className="icon">❓</span> Preguntas
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/tests" className={({isActive}) => isActive ? activeAdminLink : inactiveAdminLink}>
                {/* Icono para Tests */}
                <span role="img" aria-label="tests" className="icon">📝</span> Tests
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/usuarios" className={({isActive}) => isActive ? activeAdminLink : inactiveAdminLink}>
                {/* Icono para Usuarios */}
                <span role="img" aria-label="usuarios" className="icon">👥</span> Usuarios
              </NavLink>
            </li>
            {}
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <p>Usuario: {user?.nombre || 'Admin'}</p>
          <button onClick={logout} className="button button-secondary button-small">
            Cerrar Sesión
          </button>
          <br />
          <Link to="/" className="button button-link button-small" style={{marginTop: '0.5rem'}}>
            Volver al Sitio Principal
          </Link>
        </div>
      </aside>
      <main className="admin-main-content-wrapper">
        <div className="admin-main-content container fade-in">
          <Outlet /> {}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
