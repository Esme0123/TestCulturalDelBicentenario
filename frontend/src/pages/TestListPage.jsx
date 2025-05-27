// src/pages/TestListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TestCard from '../components/tests/TestCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';
import './TestListPage.css';

function TestListPage() {
  const [tests, setTests] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [filtros, setFiltros] = useState({
    id_categoria: '',
    id_dificultad: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [testsRes, catRes, difRes] = await Promise.all([
        api.get('/tests', { params: filtros }), // Enviar filtros iniciales (vacíos)
        api.get('/categorias'),
        api.get('/dificultades')
      ]);
      setTests(testsRes.data);
      setCategorias(catRes.data);
      setDificultades(difRes.data);
    } catch (err) {
      console.error("Error cargando datos para TestListPage:", err);
      setNotification({ message: 'No se pudieron cargar los tests o filtros.', type: 'error' });
      setTests([]); // Asegurar que tests esté vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  }, [filtros]); // Depender de filtros para recargar si cambian

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]); // Solo se llama una vez al montar o si filtros cambia

  const handleFilterChange = (e) => {
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    // La recarga se maneja por el useEffect que depende de 'filtros'
    // Si quieres un botón explícito de "Aplicar Filtros", entonces la llamada a fetch sería aquí
    // y 'filtros' no necesitaría estar en la dependencia del useEffect de fetchInitialData.
    // Por simplicidad, la recarga es automática al cambiar un select.
    // Para forzar la recarga explícita, podrías llamar a fetchInitialData aquí.
    // fetchInitialData(); <--- si quieres botón de aplicar
    console.log("Filtros aplicados:", filtros);
  };

   const clearFilters = () => {
    setFiltros({ id_categoria: '', id_dificultad: '' });
    // La recarga se hará automáticamente por el useEffect
  };


  return (
    <div className="test-list-page container fade-in">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="page-header">
        <h1><span role="img" aria-label="examen" className="icon">📝</span> Tests Disponibles</h1>
        <p>Elige un test para poner a prueba tus conocimientos sobre el Bicentenario de Bolivia.</p>
      </header>

      <aside className="filters-sidebar card">
        <h2 className="filters-title">Filtrar Tests</h2>
        <div className="filter-group">
          <label htmlFor="id_categoria" className="form-label">Categoría:</label>
          <select
            name="id_categoria"
            id="id_categoria"
            value={filtros.id_categoria}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="id_dificultad" className="form-label">Dificultad:</label>
          <select
            name="id_dificultad"
            id="id_dificultad"
            value={filtros.id_dificultad}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">Todos los niveles</option>
            {dificultades.map(dif => (
              <option key={dif.id_dificultad} value={dif.id_dificultad}>{dif.dificultad}</option>
            ))}
          </select>
        </div>
         <button onClick={clearFilters} className="button button-secondary clear-filters-button">
            Limpiar Filtros
        </button>
        {/* <button onClick={applyFilters} className="button button-primary apply-filters-button">Aplicar Filtros</button> */}
      </aside>

      <main className="tests-grid-container">
        {isLoading ? (
          <LoadingSpinner text="Cargando tests..." />
        ) : tests.length > 0 ? (
          <div className="tests-grid">
            {tests.map(test => (
              <TestCard key={test.id_test} test={test} />
            ))}
          </div>
        ) : (
          <p className="no-tests-message">
            No se encontraron tests con los filtros seleccionados. ¡Intenta con otros criterios!
          </p>
        )}
      </main>
    </div>
  );
}

export default TestListPage;
