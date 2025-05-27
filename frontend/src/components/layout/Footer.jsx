// src/components/layout/Footer.jsx
import React from 'react';
// El CSS para el footer está en src/layouts/Layout.css

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <p>&copy; {currentYear} Test Cultural del Bicentenario - Bolivia.</p>
        <p>
          Desarrollado con <span role="img" aria-label="corazón">❤️</span> para Tecnologías Web I.
          {/* enlaces o información aquí */}
        </p>
        {/* <p>
          <Link to="/terminos">Términos y Condiciones</Link> | <Link to="/privacidad">Política de Privacidad</Link>
        </p> */}
      </div>
    </footer>
  );
}

export default Footer;
