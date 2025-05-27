// src/components/ui/Notification.jsx
import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, type = 'info', onClose, duration = 5000 }) {
  // type puede ser 'info', 'success', 'error', 'warning'

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [duration, onClose]);

  if (!message) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return <span role="img" aria-label="éxito">✅</span>;
      case 'error': return <span role="img" aria-label="error">❌</span>;
      case 'warning': return <span role="img" aria-label="advertencia">⚠️</span>;
      case 'info':
      default:
        return <span role="img" aria-label="información">ℹ️</span>;
    }
  };

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">{getIcon()}</span>
      <p className="notification-message">{message}</p>
      {onClose && (
        <button onClick={onClose} className="notification-close-button" aria-label="Cerrar notificación">
          &times;
        </button>
      )}
    </div>
  );
}

export default Notification;
