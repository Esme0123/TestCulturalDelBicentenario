import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer'; 
import './Layout.css';

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container fade-in"> {/* Añadida clase fade-in */}
        <Outlet />
      </main>
      <Footer /> {/* Añadir Footer al layout */}
    </div>
  );
}

export default AppLayout;
