// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css'; // CSS específico para HomePage

// import heroImage from '../assets/bolivia-hero.jpg'; // Ejemplo

function HomePage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="homepage-container">
      <header className="hero-section">
        {/* <img src={heroImage} alt="Paisaje Boliviano" className="hero-image" /> */}
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">
            <span role="img" aria-label="Bandera de Bolivia" style={{fontSize: '3rem', verticalAlign: 'middle'}}>🇧🇴</span> Test Cultural del Bicentenario
          </h1>
          <p className="hero-subtitle">
            Descubre y celebra la rica historia y cultura de Bolivia. ¡Pon a prueba tus conocimientos!
          </p>
          <div className="hero-cta">
            {isLoggedIn ? (
              <Link to="/tests" className="button button-primary button-lg">
                <span role="img" aria-label="examen" className="icon">📝</span> Comenzar un Test
              </Link>
            ) : (
              <Link to="/register" className="button button-primary button-lg">
                <span role="img" aria-label="registrarse" className="icon">🚀</span> ¡Regístrate y Juega!
              </Link>
            )}
            <Link to="/rankings" className="button button-secondary button-lg">
              <span role="img" aria-label="trofeo" className="icon">🏆</span> Ver Rankings
            </Link>
          </div>
        </div>
      </header>

      <section className="features-section container">
        <h2 className="section-title">¿Qué encontrarás?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon"><span role="img" aria-label="preguntas variadas">❓</span></div>
            <h3 className="feature-title">Preguntas Variadas</h3>
            <p>Opción múltiple, verdadero/falso y más, cubriendo historia, arte, tradiciones y gastronomía.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><span role="img" aria-label="niveles">📊</span></div>
            <h3 className="feature-title">Niveles de Dificultad</h3>
            <p>Desde básico hasta avanzado, para desafiar a todos los entusiastas de la cultura boliviana.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><span role="img" aria-label="insignias">🏅</span></div>
            <h3 className="feature-title">Logros e Insignias</h3>
            <p>Gana reconocimientos por tu desempeño y demuestra tu conocimiento sobre Bolivia.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><span role="img" aria-label="comunidad">👥</span></div>
            <h3 className="feature-title">Compite y Aprende</h3>
            <p>Compara tus puntajes en los rankings y aprende con explicaciones detalladas.</p>
          </div>
        </div>
      </section>

      {isLoggedIn && user && (
        <section className="welcome-back-section container">
          <h2 className="section-title">¡Bienvenido de nuevo, {user.nombre}!</h2>
          <p>¿Listo para tu próximo desafío cultural? Explora los tests disponibles o revisa tu progreso.</p>
          {/* resumen del último test o estadísticas rápidas */}
        </section>
      )}

      {/* Puedes añadir más secciones: testimonios, sobre el bicentenario, etc. */}

    </div>
  );
}

export default HomePage;
