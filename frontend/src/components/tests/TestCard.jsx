// src/components/tests/TestCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './TestCard.css'; // CSS específico para TestCard

// Función para obtener un color basado en la categoría o dificultad (simple)
const getAccentColor = (categoryName) => {
  if (!categoryName) return 'var(--primary-color)';
  const lowerCategory = categoryName.toLowerCase();
  if (lowerCategory.includes('historia')) return 'var(--accent-color-red)';
  if (lowerCategory.includes('arte')) return 'var(--accent-color-yellow)';
  if (lowerCategory.includes('tradiciones')) return 'var(--accent-color-green)';
  return 'var(--primary-color)';
};


function TestCard({ test }) {
  const { id_test, nombre, descripcion, categoria_nombre, dificultad_nombre } = test;
  const accentColor = getAccentColor(categoria_nombre);

  return (
    <article className="test-card" style={{ '--card-accent-color': accentColor }}>
      <div className="card-content">
        <header className="card-header">
          <h3 className="card-title">{nombre}</h3>
          {categoria_nombre && <span className="card-category">{categoria_nombre}</span>}
        </header>
        <p className="card-description">
          {descripcion || 'Un desafiante test para probar tus conocimientos.'}
        </p>
        <footer className="card-footer">
          {dificultad_nombre && <span className="card-difficulty">{dificultad_nombre}</span>}
          <Link to={`/test/${id_test}`} className="button button-primary card-button">
            <span role="img" aria-label="jugar" className="icon">▶️</span> Jugar Test
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default TestCard;
