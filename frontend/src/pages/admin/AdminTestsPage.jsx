// src/pages/admin/AdminTestsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Para enlaces futuros, ej. a gestionar preguntas de un test
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Notification from '../../components/ui/Notification';
import './AdminStyles.css'; // Estilos generales para páginas de admin
import '../FormStyles.css'; // Para el modal y formulario

// Componente Modal (puedes crear un archivo separado para él si lo usas en múltiples sitios)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '600px'}}> {/* Ancho del modal */}
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} className="modal-close-button" aria-label="Cerrar modal">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// Formulario para Crear/Editar Test Base
const TestForm = ({ initialData, onSubmit, onCancel, categorias, dificultades, isLoading }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        id_categoria: '',
        id_dificultad: '',
        es_publico: true, // Por defecto los tests base son públicos
        ...initialData, // Sobrescribir con datos iniciales si se edita
    });
    const [errors, setErrors] = useState({});

    // Actualizar formData si initialData cambia (cuando se abre el modal para editar)
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                id_categoria: initialData.id_categoria || '',
                id_dificultad: initialData.id_dificultad || '',
                es_publico: initialData.es_publico !== undefined ? initialData.es_publico : true,
            });
        } else { // Resetea para "crear nuevo"
             setFormData({
                nombre: '',
                descripcion: '',
                id_categoria: '',
                id_dificultad: '',
                es_publico: true,
            });
        }
        setErrors({}); // Limpiar errores al cambiar de modo
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: undefined })); // Limpiar error al cambiar
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del test es requerido.';
        if (!formData.id_categoria) newErrors.id_categoria = 'Debe seleccionar una categoría.';
        if (!formData.id_dificultad) newErrors.id_dificultad = 'Debe seleccionar un nivel de dificultad.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Asegurarse que los IDs sean números si el backend los espera así
            const dataToSend = {
                ...formData,
                id_categoria: parseInt(formData.id_categoria, 10),
                id_dificultad: parseInt(formData.id_dificultad, 10),
            };
            onSubmit(dataToSend);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-body form-compact">
            <div className="form-group">
                <label htmlFor="test-nombre" className="form-label">Nombre del Test</label>
                <input type="text" id="test-nombre" name="nombre" required value={formData.nombre} onChange={handleChange} className={`form-input ${errors.nombre ? 'input-error' : ''}`} disabled={isLoading} />
                {errors.nombre && <p className="form-error">{errors.nombre}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="test-descripcion" className="form-label">Descripción (Opcional)</label>
                <textarea id="test-descripcion" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} className="form-textarea" disabled={isLoading} />
            </div>
            <div className="form-grid-2"> {/* Para poner categoría y dificultad lado a lado */}
                 <div className="form-group">
                    <label htmlFor="test-id_categoria" className="form-label">Categoría</label>
                    <select id="test-id_categoria" name="id_categoria" required value={formData.id_categoria} onChange={handleChange} className={`form-select ${errors.id_categoria ? 'input-error' : ''}`} disabled={isLoading}>
                        <option value="">Seleccione una categoría...</option>
                        {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                    {errors.id_categoria && <p className="form-error">{errors.id_categoria}</p>}
                </div>
                 <div className="form-group">
                    <label htmlFor="test-id_dificultad" className="form-label">Dificultad</label>
                    <select id="test-id_dificultad" name="id_dificultad" required value={formData.id_dificultad} onChange={handleChange} className={`form-select ${errors.id_dificultad ? 'input-error' : ''}`} disabled={isLoading}>
                        <option value="">Seleccione un nivel...</option>
                        {dificultades.map(d => <option key={d.id_dificultad} value={d.id_dificultad}>{d.dificultad}</option>)}
                    </select>
                    {errors.id_dificultad && <p className="form-error">{errors.id_dificultad}</p>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-checkbox-label">
                    <input type="checkbox" name="es_publico" checked={formData.es_publico} onChange={handleChange} className="form-checkbox" disabled={isLoading} />
                    Público (visible para todos los usuarios)
                </label>
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="button button-secondary" disabled={isLoading}>Cancelar</button>
                <button type="submit" className="button button-primary" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="small" text=""/> : (initialData ? 'Actualizar Test' : 'Crear Test')}
                </button>
            </div>
        </form>
    );
};


function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para carga inicial de la tabla
  const [isSubmitting, setIsSubmitting] = useState(false); // Para el formulario del modal
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      const [testsRes, catRes, difRes] = await Promise.all([
        api.get('/admin/tests'), // Endpoint de admin para obtener tests
        api.get('/categorias'),   // Endpoint público para categorías
        api.get('/dificultades')  // Endpoint público para dificultades
      ]);
      setTests(testsRes.data || []);
      setCategorias(catRes.data || []);
      setDificultades(difRes.data || []);
    } catch (err) {
      console.error("Error cargando datos para AdminTestsPage:", err);
      setNotification({ message: 'No se pudieron cargar los tests o datos auxiliares.', type: 'error' });
      setTests([]); // Asegurar que tests sea un array en caso de error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => { setEditingTest(null); setIsModalOpen(true); };
  const handleEdit = (test) => { setEditingTest(test); setIsModalOpen(true); };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
    // No limpiar notificación global aquí, solo la del modal si la hubiera
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    handleNotificationClose(); // Limpiar notificaciones previas
    try {
      if (editingTest) {
        await api.put(`/admin/tests/${editingTest.id_test}`, formData);
        setNotification({ message: 'Test actualizado correctamente.', type: 'success' });
      } else {
        await api.post(`/admin/tests`, formData);
        setNotification({ message: 'Test creado correctamente.', type: 'success' });
      }
      handleCloseModal();
      fetchData(); // Recargar lista de tests
    } catch (err) {
      console.error("Error guardando test:", err.response?.data || err);
      setNotification({ message: err.response?.data?.message || 'Error al guardar el test.', type: 'error' });
      // No cerrar modal en error para que el usuario corrija, o sí, dependiendo de UX deseada
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id_test, testName) => {
    if (window.confirm(`¿Estás seguro de eliminar el test "${testName}" (ID: ${id_test})? Esta acción es irreversible y podría afectar historiales si no se maneja con cuidado en el backend.`)) {
      setIsLoading(true); // Usar isLoading general para la acción de borrado en tabla
      handleNotificationClose();
      try {
        await api.delete(`/admin/tests/${id_test}`);
        setNotification({ message: `Test "${testName}" eliminado.`, type: 'success' });
        fetchData(); // Recargar lista
      } catch (err) {
        console.error("Error eliminando test:", err.response?.data || err);
        setNotification({ message: err.response?.data?.message || 'Error al eliminar el test.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Mostrar spinner de carga principal si isLoading es true Y no hay tests cargados aún (para evitar parpadeo al recargar)
  if (isLoading && tests.length === 0) {
    return <div className="page-loading-container"><LoadingSpinner text="Cargando tests..." /></div>;
  }

  return (
    <div className="admin-page-container">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="admin-page-header">
        <h1 className="admin-page-title">Gestionar Tests Base</h1>
        <button onClick={handleAddNew} className="button button-primary add-button">
          <span role="img" aria-label="nuevo test" className="icon">➕</span> Nuevo Test Base
        </button>
      </header>

      {isLoading && tests.length > 0 && <LoadingSpinner text="Actualizando lista..." /> /* Spinner más pequeño para recargas */}

      {!isLoading && tests.length === 0 ? (
        <p className="admin-no-data-message card">No hay tests base creados todavía.</p>
      ) : tests.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Dificultad</th>
                <th>Preg.</th>
                <th>Público</th>
                <th>Creador</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id_test}>
                  <td>{test.id_test}</td>
                  <td data-label="Nombre" className="table-cell-truncate" title={test.nombre}>{test.nombre}</td>
                  <td data-label="Categoría">{test.categoria_nombre || 'N/A'}</td>
                  <td data-label="Dificultad">{test.dificultad_nombre || 'N/A'}</td>
                  <td data-label="Preguntas">{test.cantidad_preguntas !== undefined ? test.cantidad_preguntas : 'N/A'}</td>
                  <td data-label="Público">{test.es_publico ? 'Sí ✅' : 'No ❌'}</td>
                  <td data-label="Creador" className="table-cell-truncate" title={test.creador_email}>{test.creador_email || 'Sistema'}</td>
                  <td data-label="Fecha">{new Date(test.fecha_creacion).toLocaleDateString()}</td>
                  <td data-label="Acciones" className="table-actions">
                    <button onClick={() => handleEdit(test)} className="button-icon button-edit" title="Editar Test">✏️</button>
                    <button onClick={() => handleDelete(test.id_test, test.nombre)} className="button-icon button-danger" title="Eliminar Test">🗑️</button>
                    <Link to={`/admin/preguntas?testFilter=${test.id_test}`} className="button-icon" title={`Ver/Asociar Preguntas a Test #${test.id_test}`}>🔗</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTest ? `Editar Test Base: ${editingTest.nombre}` : 'Crear Nuevo Test Base'}>
        <TestForm
          key={editingTest ? `edit-${editingTest.id_test}` : 'new-test'} // Key para forzar re-montado
          initialData={editingTest}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          categorias={categorias}
          dificultades={dificultades}
          isLoading={isSubmitting}
        />
         {/* Notificación específica del modal si es necesaria */}
         {notification.message && isModalOpen && <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />}
      </Modal>
    </div>
  );
}

export default AdminTestsPage;
