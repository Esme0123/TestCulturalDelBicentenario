// src/pages/admin/AdminTestsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Notification from '../../components/ui/Notification';
// Reutilizaremos AdminStyles.css y FormStyles.css
import './AdminStyles.css';
import '../FormStyles.css'; // Para el modal de formulario

// Modal (puedes copiarlo de AdminQuestionsPage.jsx o crear un componente reutilizable)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '600px'}}> {/* Ajustar ancho si es necesario */}
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} className="modal-close-button">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// Formulario para Test (similar a QuestionForm pero para Tests)
const TestForm = ({ initialData, onSubmit, onCancel, categorias, dificultades }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        id_categoria: '',
        id_dificultad: '',
        es_publico: true,
        ...initialData,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
        if (!formData.id_categoria) newErrors.id_categoria = 'Seleccione una categoría.';
        if (!formData.id_dificultad) newErrors.id_dificultad = 'Seleccione una dificultad.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-body form-compact">
            <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre del Test</label>
                <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} className={`form-input ${errors.nombre ? 'input-error' : ''}`} />
                {errors.nombre && <p className="form-error">{errors.nombre}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="descripcion" className="form-label">Descripción (Opcional)</label>
                <textarea id="descripcion" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} className="form-textarea" />
            </div>
            <div className="form-grid-2"> {/* Clase para grid de 2 columnas */}
                 <div className="form-group">
                    <label htmlFor="id_categoria" className="form-label">Categoría</label>
                    <select id="id_categoria" name="id_categoria" required value={formData.id_categoria} onChange={handleChange} className={`form-select ${errors.id_categoria ? 'input-error' : ''}`}>
                        <option value="">Seleccione...</option>
                        {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                    {errors.id_categoria && <p className="form-error">{errors.id_categoria}</p>}
                </div>
                 <div className="form-group">
                    <label htmlFor="id_dificultad" className="form-label">Dificultad</label>
                    <select id="id_dificultad" name="id_dificultad" required value={formData.id_dificultad} onChange={handleChange} className={`form-select ${errors.id_dificultad ? 'input-error' : ''}`}>
                        <option value="">Seleccione...</option>
                        {dificultades.map(d => <option key={d.id_dificultad} value={d.id_dificultad}>{d.dificultad}</option>)}
                    </select>
                    {errors.id_dificultad && <p className="form-error">{errors.id_dificultad}</p>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-checkbox-label">
                    <input type="checkbox" name="es_publico" checked={formData.es_publico} onChange={handleChange} className="form-checkbox" />
                    ¿Es Público? (Visible para todos los usuarios)
                </label>
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="button button-secondary">Cancelar</button>
                <button type="submit" className="button button-primary">{initialData ? 'Actualizar Test' : 'Crear Test'}</button>
            </div>
        </form>
    );
};


function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null); // null para crear, objeto para editar

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      // Asumimos que /api/v1/tests (GET) devuelve todos los tests para el admin
      // y que /api/v1/admin/tests podría ser una ruta específica para admin si fuera necesario.
      // Por ahora, usaremos la ruta pública de tests y las de admin para CUD.
      const [testsRes, catRes, difRes] = await Promise.all([
        api.get('/tests?adminView=true'), // Añadir un query param si es necesario para diferenciar la vista admin
        api.get('/categorias'),
        api.get('/dificultades')
      ]);
      setTests(testsRes.data || []);
      setCategorias(catRes.data || []);
      setDificultades(difRes.data || []);
    } catch (err) {
      console.error("Error cargando datos para AdminTestsPage:", err);
      setNotification({ message: 'No se pudieron cargar los tests o datos auxiliares.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => { setEditingTest(null); setIsModalOpen(true); };
  const handleEdit = (test) => { setEditingTest(test); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTest(null); setNotification({ message: '', type: '' }); };

  const handleFormSubmit = async (formData) => {
    // En un CRUD de admin para tests, no enviaríamos 'id_usuario_creador'
    // o el backend lo asignaría al admin actual o lo dejaría NULL.
    // Tampoco 'es_personalizado' ni 'preguntas' desde aquí, eso se maneja aparte.
    const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        id_categoria: parseInt(formData.id_categoria),
        id_dificultad: parseInt(formData.id_dificultad),
        es_publico: formData.es_publico,
    };

    setIsLoading(true); // Podría ser un loading específico del modal
    try {
      if (editingTest) {
        // Asumimos un endpoint PUT /api/v1/admin/tests/:id_test
        await api.put(`/admin/tests/${editingTest.id_test}`, dataToSend);
        setNotification({ message: 'Test actualizado correctamente.', type: 'success' });
      } else {
        // Asumimos un endpoint POST /api/v1/admin/tests
        await api.post(`/admin/tests`, dataToSend); // O usar /api/v1/tests/crear si el admin puede usarlo
        setNotification({ message: 'Test creado correctamente.', type: 'success' });
      }
      handleCloseModal();
      fetchData(); // Recargar lista
    } catch (err) {
      console.error("Error guardando test:", err.response?.data || err);
      setNotification({ message: err.response?.data?.message || 'Error al guardar el test.', type: 'error' });
      // No cerrar modal en error para que el usuario corrija
    } finally {
      setIsLoading(false); // Quitar loading del modal
    }
  };

  const handleDelete = async (id_test) => {
    if (window.confirm(`¿Estás seguro de eliminar el test #${id_test}? Esto podría afectar tests personalizados de usuarios si no se maneja con cuidado.`)) {
      setIsLoading(true);
      try {
        // Asumimos un endpoint DELETE /api/v1/admin/tests/:id_test
        await api.delete(`/admin/tests/${id_test}`);
        setNotification({ message: `Test #${id_test} eliminado.`, type: 'success' });
        fetchData(); // Recargar lista
      } catch (err) {
        console.error("Error eliminando test:", err.response?.data || err);
        setNotification({ message: err.response?.data?.message || 'Error al eliminar el test.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && tests.length === 0) { // Mostrar spinner solo si no hay datos previos
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

      {tests.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Dificultad</th>
                <th>Público</th>
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
                  <td data-label="Público">{test.es_publico ? 'Sí ✅' : 'No ❌'}</td>
                  <td data-label="Acciones" className="table-actions">
                    <button onClick={() => handleEdit(test)} className="button-icon button-edit" title="Editar">✏️</button>
                    <button onClick={() => handleDelete(test.id_test)} className="button-icon button-danger" title="Eliminar">🗑️</button>
                    {/* Podrías añadir un botón para ir a "Asociar Preguntas" si esa es una acción separada */}
                    {/* <Link to={`/admin/tests/${test.id_test}/preguntas`} className="button-icon" title="Gestionar Preguntas">🔗</Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p className="admin-no-data-message">No hay tests base creados todavía.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTest ? 'Editar Test Base' : 'Crear Nuevo Test Base'}>
        <TestForm
          key={editingTest ? editingTest.id_test : 'new-test'}
          initialData={editingTest}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          categorias={categorias}
          dificultades={dificultades}
        />
      </Modal>
    </div>
  );
}

export default AdminTestsPage;
