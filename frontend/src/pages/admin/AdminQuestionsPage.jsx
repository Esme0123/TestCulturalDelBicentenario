import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
// import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './AdminStyles.css'; 
import '../FormStyles.css';

// --- Componente Modal  ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay"> {/* Clase para el fondo oscuro */}
            <div className="modal-content"> {/* Clase para el contenedor del modal */}
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} className="modal-close-button">
                        {/* Reemplazar icono XMarkIcon */}
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};


// --- Componente QuestionForm (Actualizado) ---
const QuestionForm = ({ initialData, onSubmit, onCancel, tipos, categorias, dificultades }) => {
    const [formData, setFormData] = useState({
        textoPregunta: '',
        id_tipo: '',
        id_categoria: '',
        id_dificultad: '',
        explicacion: '',
        ...initialData,
        respuestas: initialData?.respuestas?.length > 0 ? initialData.respuestas : [{ texto: '', es_correcta: false }],
        lecturas_videos: initialData?.lecturas_videos || [],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleRespuestaChange = (index, field, value) => {
        const newRespuestas = [...formData.respuestas];
        newRespuestas[index][field] = value;
        setFormData(prev => ({ ...prev, respuestas: newRespuestas }));
         setErrors(prev => ({ ...prev, respuestas: undefined }));
    };

    const addRespuesta = () => {
        setFormData(prev => ({ ...prev, respuestas: [...prev.respuestas, { texto: '', es_correcta: false }] }));
    };
    const removeRespuesta = (index) => {
        if (formData.respuestas.length <= 1) return;
        setFormData(prev => ({ ...prev, respuestas: formData.respuestas.filter((_, i) => i !== index) }));
    };

     const handleLecturaChange = (index, field, value) => {
        const newLecturas = [...formData.lecturas_videos];
        newLecturas[index][field] = value;
        setFormData(prev => ({ ...prev, lecturas_videos: newLecturas }));
    };
    const addLectura = () => {
        setFormData(prev => ({ ...prev, lecturas_videos: [...prev.lecturas_videos, { titulo: '', tipo: 'Lectura', url: '' }] }));
    };
    const removeLectura = (index) => {
        setFormData(prev => ({ ...prev, lecturas_videos: formData.lecturas_videos.filter((_, i) => i !== index) }));
    };

    const validateForm = () => {
        // ... (lógica de validación sin cambios) ...
        const newErrors = {};
        if (!formData.textoPregunta.trim()) newErrors.textoPregunta = 'El texto es requerido.';
        if (!formData.id_tipo) newErrors.id_tipo = 'Seleccione un tipo.';
        if (!formData.id_categoria) newErrors.id_categoria = 'Seleccione una categoría.';
        if (!formData.id_dificultad) newErrors.id_dificultad = 'Seleccione una dificultad.';
        if (!formData.respuestas || formData.respuestas.length === 0 || formData.respuestas.some(r => !r.texto.trim())) {
             newErrors.respuestas = 'Debe haber al menos una respuesta y todas deben tener texto.';
        }
        const tipoSeleccionado = tipos.find(t => t.id_tipo === parseInt(formData.id_tipo));
        if (tipoSeleccionado && tipoSeleccionado.tipo !== 'Abierta' && !formData.respuestas.some(r => r.es_correcta)) {
             newErrors.respuestas = 'Debe marcar al menos una respuesta como correcta para este tipo.';
        }
        if (formData.lecturas_videos.some(lv => !lv.url.trim() || !lv.titulo.trim())) {
             newErrors.lecturas_videos = 'Todas las lecturas/videos deben tener título y URL.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSend = {
                ...formData,
                respuestas: formData.respuestas.map(({ id_respuesta, ...rest }) => rest),
                lecturas_videos: formData.lecturas_videos.map(({ id_lectura, ...rest }) => rest),
            };
            onSubmit(dataToSend);
        }
    };

    return (
        // Usa clases de FormStyles.css
        <form onSubmit={handleSubmit} className="form-body form-compact"> {/* Añadida clase form-compact */}
            {/* Texto Pregunta */}
            <div className="form-group">
                <label htmlFor="textoPregunta" className="form-label">Texto de la Pregunta</label>
                <textarea
                    id="textoPregunta" name="textoPregunta" rows="3" required
                    value={formData.textoPregunta} onChange={handleChange}
                    className={`form-textarea ${errors.textoPregunta ? 'input-error' : ''}`}
                />
                 {errors.textoPregunta && <p className="form-error">{errors.textoPregunta}</p>}
            </div>

             {/* Selects: Tipo, Categoría, Dificultad */}
            <div className="form-grid-3"> {/* Clase para grid */}
                 <div className="form-group">
                    <label htmlFor="id_tipo" className="form-label">Tipo</label>
                    <select id="id_tipo" name="id_tipo" required value={formData.id_tipo} onChange={handleChange} className={`form-select ${errors.id_tipo ? 'input-error' : ''}`}>
                        <option value="">Seleccione...</option>
                        {tipos.map(t => <option key={t.id_tipo} value={t.id_tipo}>{t.tipo}</option>)}
                    </select>
                    {errors.id_tipo && <p className="form-error">{errors.id_tipo}</p>}
                </div>
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

            {/* Explicación */}
            <div className="form-group">
                <label htmlFor="explicacion" className="form-label">Explicación (Opcional)</label>
                <textarea id="explicacion" name="explicacion" rows="2"
                    value={formData.explicacion} onChange={handleChange}
                    className="form-textarea"
                />
            </div>

            {/* Respuestas */}
            <div className="form-section"> {/* Clase para agrupar */}
                 <h4 className="form-section-title">Respuestas Posibles</h4>
                 {errors.respuestas && <p className="form-error">{errors.respuestas}</p>}
                 {formData.respuestas.map((resp, index) => (
                    <div key={index} className="form-repeater-item"> {/* Clase para item repetido */}
                       <input type="text" placeholder={`Texto Respuesta ${index + 1}`} required
                            value={resp.texto} onChange={(e) => handleRespuestaChange(index, 'texto', e.target.value)}
                            className="form-input repeater-text-input" /* Clase específica */
                        />
                        <label className="form-checkbox-label repeater-checkbox-label">
                            <input type="checkbox" checked={resp.es_correcta}
                                onChange={(e) => handleRespuestaChange(index, 'es_correcta', e.target.checked)}
                                className="form-checkbox"
                            />
                            <span>Correcta</span>
                        </label>
                        <button type="button" onClick={() => removeRespuesta(index)}
                            disabled={formData.respuestas.length <= 1}
                            className="button-icon button-danger repeater-delete-button" /* Clases */
                            aria-label="Eliminar respuesta"
                        >
                           <span role="img" aria-label="Eliminar">🗑️</span>
                        </button>
                    </div>
                 ))}
                 <button type="button" onClick={addRespuesta} className="button-link add-repeater-button">
                    <span role="img" aria-label="Añadir">➕</span> Añadir Respuesta
                 </button>
            </div>

             {/* Lecturas/Videos */}
             <div className="form-section">
                 <h4 className="form-section-title">Recursos Educativos (Opcional)</h4>
                 {errors.lecturas_videos && <p className="form-error">{errors.lecturas_videos}</p>}
                 {formData.lecturas_videos.map((lv, index) => (
                     <div key={index} className="form-repeater-item form-grid-4"> {/* Grid de 4 */}
                         <input type="text" placeholder="Título" required value={lv.titulo}
                            onChange={(e) => handleLecturaChange(index, 'titulo', e.target.value)}
                            className="form-input"
                        />
                         <select value={lv.tipo} onChange={(e) => handleLecturaChange(index, 'tipo', e.target.value)}
                            className="form-select"
                         >
                             <option value="Lectura">Lectura</option>
                             <option value="Video">Video</option>
                             <option value="Otro">Otro</option>
                         </select>
                         <input type="url" placeholder="URL" required value={lv.url}
                            onChange={(e) => handleLecturaChange(index, 'url', e.target.value)}
                             className="form-input"
                         />
                         <button type="button" onClick={() => removeLectura(index)}
                            className="button-icon button-danger repeater-delete-button"
                             aria-label="Eliminar recurso"
                         >
                            <span role="img" aria-label="Eliminar">🗑️</span>
                        </button>
                     </div>
                 ))}
                  <button type="button" onClick={addLectura} className="button-link add-repeater-button">
                     <span role="img" aria-label="Añadir">➕</span> Añadir Recurso
                 </button>
             </div>

            {/* Botones de Acción */}
            <div className="form-actions"> {/* Clase para botones */}
                <button type="button" onClick={onCancel} className="button button-secondary">
                    Cancelar
                </button>
                <button type="submit" className="button button-primary">
                    {initialData ? 'Actualizar Pregunta' : 'Crear Pregunta'}
                </button>
            </div>
        </form>
    );
};


// --- Página Principal de Admin Questions (Actualizada) ---
function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [tiposPregunta, setTiposPregunta] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dificultades, setDificultades] = useState([]);

  const fetchData = useCallback(async () => {
    // ... (lógica de fetch sin cambios) ...
     setLoading(true);
    setError('');
    try {
        const [qRes, tRes, cRes, dRes] = await Promise.all([
            api.get('/admin/preguntas'),
            api.get('/preguntas/tipos'),
            api.get('/categorias'),
            api.get('/dificultades')
        ]);
        setQuestions(qRes.data);
        setTiposPregunta(tRes.data);
        setCategorias(cRes.data);
        setDificultades(dRes.data);
    } catch (err) {
        console.error("Error cargando datos:", err);
        setError('Error al cargar los datos. Intenta recargar la página.');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddNew = () => { setEditingQuestion(null); setIsModalOpen(true); };
  const handleEdit = (question) => {
    setEditingQuestion({
        ...question,
        respuestas: question.respuestas || [],
        lecturas_videos: question.lecturas_videos || [],
    });
    setIsModalOpen(true);
   };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingQuestion(null); };

  const handleFormSubmit = async (formData) => {
    // ... (lógica de submit sin cambios) ...
     setLoading(true);
    try {
        if (editingQuestion) {
            await api.put(`/admin/preguntas/${editingQuestion.id_pregunta}`, formData);
        } else {
            await api.post('/admin/preguntas', formData);
        }
        handleCloseModal();
        fetchData();
    } catch (err) {
         console.error("Error guardando pregunta:", err.response?.data || err);
         setError(err.response?.data?.message || 'Error al guardar la pregunta.');
    } finally {
         setLoading(false);
    }
  };

  const handleDelete = async (id_pregunta) => {
    // ... (lógica de delete sin cambios) ...
     if (window.confirm(`¿Estás seguro de eliminar la pregunta ${id_pregunta}?`)) {
        setLoading(true);
        try {
            await api.delete(`/admin/preguntas/${id_pregunta}`);
            fetchData();
        } catch (err) {
             console.error("Error eliminando pregunta:", err.response?.data || err);
             setError(err.response?.data?.message || 'Error al eliminar la pregunta.');
        } finally {
             setLoading(false);
        }
    }
  };

  return (
    // Usa clases de AdminStyles.css
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Administrar Preguntas</h1>
        <button onClick={handleAddNew} className="button button-primary add-button">
          {/* Reemplazar icono PlusIcon */}
          <span role="img" aria-label="Añadir">➕</span> Nueva Pregunta
        </button>
      </div>

      {error && <p className="admin-error-message">{error}</p>}
      {loading && <p className="admin-loading-message">Cargando preguntas...</p>}

      {!loading && questions.length === 0 && <p className="admin-no-data-message">No hay preguntas creadas todavía.</p>}

      {!loading && questions.length > 0 && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Texto Pregunta</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Dificultad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id_pregunta}>
                  <td>{q.id_pregunta}</td>
                  <td className="table-cell-truncate" title={q.textoPregunta}>{q.textoPregunta}</td>
                  <td>{q.tipoPregunta}</td>
                  <td>{q.categoria_nombre || 'N/A'}</td>
                  <td>{q.dificultad_nombre || 'N/A'}</td>
                  <td className="table-actions">
                    <button onClick={() => handleEdit(q)} className="button-icon button-edit" title="Editar">
                      {/* Reemplazar icono PencilIcon */}
                      <span role="img" aria-label="Editar">✏️</span>
                    </button>
                    <button onClick={() => handleDelete(q.id_pregunta)} className="button-icon button-danger" title="Eliminar">
                      {/* Reemplazar icono TrashIcon */}
                       <span role="img" aria-label="Eliminar">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        {/* Modal para Crear/Editar */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}
            title={editingQuestion ? `Editar Pregunta #${editingQuestion.id_pregunta}` : 'Crear Nueva Pregunta'}
        >
             <QuestionForm
                key={editingQuestion ? editingQuestion.id_pregunta : 'new'}
                initialData={editingQuestion}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseModal}
                tipos={tiposPregunta}
                categorias={categorias}
                dificultades={dificultades}
            />
             {/* Mostrar error del submit dentro del modal */}
             {error && <p className="form-error modal-form-error">{error}</p>}
        </Modal>

    </div>
  );
}

export default AdminQuestionsPage;
