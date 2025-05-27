// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null); // Referencia al contenedor del menú

  const activeClassName = "nav-link active";
  const inactiveClassName = "nav-link";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cerrar menú si se hace clic fuera de él (en móvil)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        // Asegurarse de que el clic no sea en el botón toggler
        if (event.target.closest('.navbar-toggler')) {
          return;
        }
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);


  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
           <span className="brand-icon" role="img" aria-label="Escudo de Bolivia">🇧🇴</span>
           Test Bicentenario
        </Link>

        <button className="navbar-toggler" onClick={toggleMobileMenu} aria-label="Toggle navigation" aria-expanded={isMobileMenuOpen}>
          {isMobileMenuOpen ? <span role="img" aria-label="cerrar menu">✖️</span> : <span role="img" aria-label="abrir menu">☰</span>}
        </button>

        <ul className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" className={({isActive}) => isActive ? activeClassName : inactiveClassName} end onClick={closeMobileMenu}><span role="img" aria-label="casa" className="icon">🏠</span> Inicio</NavLink></li>
          <li><NavLink to="/tests" className={({isActive}) => isActive ? activeClassName : inactiveClassName} onClick={closeMobileMenu}><span role="img" aria-label="examen" className="icon">📝</span> Tests</NavLink></li>
          <li><NavLink to="/rankings" className={({isActive}) => isActive ? activeClassName : inactiveClassName} onClick={closeMobileMenu}><span role="img" aria-label="trofeo" className="icon">🏆</span> Rankings</NavLink></li>

          {isLoggedIn && (
            <>
              <li><NavLink to="/historial" className={({isActive}) => isActive ? activeClassName : inactiveClassName} onClick={closeMobileMenu}><span role="img" aria-label="historial" className="icon">📜</span> Historial</NavLink></li>
              <li><NavLink to="/desafios" className={({isActive}) => isActive ? activeClassName : inactiveClassName} onClick={closeMobileMenu}><span role="img" aria-label="desafio" className="icon">⚔️</span> Desafíos</NavLink></li>
               <li><NavLink to="/perfil" className={({isActive}) => isActive ? activeClassName : inactiveClassName} onClick={closeMobileMenu}><span role="img" aria-label="perfil" className="icon">👤</span> Perfil</NavLink></li>
               {isAdmin && (
                   <li><NavLink to="/admin" className={({isActive}) => isActive ? `${activeClassName} admin-link` : `${inactiveClassName} admin-link`} onClick={closeMobileMenu}><span role="img" aria-label="admin" className="icon">🛡️</span> Admin</NavLink></li>
               )}
              <li className="nav-item-button mobile-only-button"> {/* Botón de salir visible en móvil */}
                <button onClick={() => { logout(); closeMobileMenu(); }} className="button button-logout">
                  <span role="img" aria-label="salir" className="icon">🚪</span> Salir
                </button>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li className="nav-item-button mobile-only-button"><NavLink to="/login" className="button button-secondary" onClick={closeMobileMenu}>Ingresar</NavLink></li>
              <li className="nav-item-button mobile-only-button"><NavLink to="/register" className="button button-register" onClick={closeMobileMenu}>Registrarse</NavLink></li>
            </>
          )}
          
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
