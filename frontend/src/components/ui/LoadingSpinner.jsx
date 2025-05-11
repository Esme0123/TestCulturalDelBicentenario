// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // CSS para el spinner

function LoadingSpinner({ size = 'medium', text = 'Cargando...' }) {
  // size puede ser 'small', 'medium', 'large'
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
