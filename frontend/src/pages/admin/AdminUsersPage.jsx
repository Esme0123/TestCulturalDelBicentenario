// src/pages/admin/AdminUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Notification from '../../components/ui/Notification';
import './AdminStyles.css';
import '../FormStyles.css'; 

// Modal (puedes copiarlo de AdminQuestionsPage.jsx o crear un componente reutilizable)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '500px'}}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} className="modal-close-button">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// Formulario para Editar Usuario (principalmente rol y opcionalmente contraseña)
const UserEditForm = ({ userData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: userData?.nombre || '',
        apellidoPaterno: userData?.apellidoPaterno || '',
        apellidoMaterno: userData?.apellidoMaterno || '',
        email: userData?.email || '',
        rol: userData?.rol || 'user',
        contrasena: '' // Dejar vacío por defecto, solo se envía si se escribe algo
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Actualizar formData si userData cambia (cuando se selecciona otro usuario para editar)
        setFormData({
            nombre: userData?.nombre || '',
            apellidoPaterno: userData?.apellidoPaterno || '',
            apellidoMaterno: userData?.apellidoMaterno || '',
            email: userData?.email || '',
            rol: userData?.rol || 'user',
            contrasena: ''
        });
        setErrors({}); // Limpiar errores al cambiar de usuario
    }, [userData]);


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({...prev, [e.target.name]: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
        if (!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = 'El apellido paterno es requerido.';
        if (!formData.email.trim()) newErrors.email = 'El email es requerido.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
        if (formData.contrasena && formData.contrasena.length < 6) {
            newErrors.contrasena = 'La nueva contraseña debe tener al menos 6 caracteres.';
        }
        if (formData.rol !== 'user' && formData.rol !== 'admin') {
            newErrors.rol = 'Rol inválido.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSend = { ...formData };
            if (!dataToSend.contrasena) { // No enviar contraseña si está vacía
                delete dataToSend.contrasena;
            }
            onSubmit(dataToSend);
        }
    };

    if (!userData) return null; // No renderizar form si no hay datos de usuario

    return (
        <form onSubmit={handleSubmit} className="form-body form-compact">
            <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} className={`form-input ${errors.nombre ? 'input-error' : ''}`} />
                {errors.nombre && <p className="form-error">{errors.nombre}</p>}
            </div>
             <div className="form-group">
                <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno</label>
                <input type="text" id="apellidoPaterno" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} className={`form-input ${errors.apellidoPaterno ? 'input-error' : ''}`} />
                {errors.apellidoPaterno && <p className="form-error">{errors.apellidoPaterno}</p>}
            </div>
             <div className="form-group">
                <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno</label>
                <input type="text" id="apellidoMaterno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={`form-input ${errors.email ? 'input-error' : ''}`} />
                {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="rol" className="form-label">Rol</label>
                <select id="rol" name="rol" value={formData.rol} onChange={handleChange} className={`form-select ${errors.rol ? 'input-error' : ''}`}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                 {errors.rol && <p className="form-error">{errors.rol}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="contrasena" className="form-label">Nueva Contraseña (opcional, mín. 6 car.)</label>
                <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleChange} className={`form-input ${errors.contrasena ? 'input-error' : ''}`} placeholder="Dejar en blanco para no cambiar"/>
                {errors.contrasena && <p className="form-error">{errors.contrasena}</p>}
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="button button-secondary">Cancelar</button>
                <button type="submit" className="button button-primary">Actualizar Usuario</button>
            </div>
        </form>
    );
};


function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Usuario a editar

  const handleNotificationClose = () => setNotification({ message: '', type: '' });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    handleNotificationClose();
    try {
      const response = await api.get('/admin/usuarios');
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error cargando usuarios (admin):", err);
      setNotification({ message: 'No se pudo cargar la lista de usuarios.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setNotification({ message: '', type: '' }); // Limpiar notificación del modal
  };

  const handleFormSubmit = async (formData) => {
    if (!editingUser) return;
    // setIsLoading(true); 
    try {
      await api.put(`/admin/usuarios/${editingUser.id_user}`, formData);
      setNotification({ message: 'Usuario actualizado correctamente.', type: 'success' });
      handleCloseModal();
      fetchUsers(); // Recargar lista
    } catch (err) {
      console.error("Error actualizando usuario:", err.response?.data || err);
      setNotification({ message: err.response?.data?.message || 'Error al actualizar el usuario.', type: 'error' });
    } finally {
      // setIsLoading(false);
    }
  };

  const handleDelete = async (id_user, userName) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${userName}" (ID: ${id_user})? Esta acción es irreversible.`)) {
      setIsLoading(true); // Loading general de página
      try {
        await api.delete(`/admin/usuarios/${id_user}`);
        setNotification({ message: `Usuario "${userName}" eliminado.`, type: 'success' });
        fetchUsers(); // Recargar lista
      } catch (err) {
        console.error("Error eliminando usuario:", err.response?.data || err);
        setNotification({ message: err.response?.data?.message || 'Error al eliminar el usuario.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <div className="page-loading-container"><LoadingSpinner text="Cargando usuarios..." /></div>;
  }

  return (
    <div className="admin-page-container">
      <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose} />
      <header className="admin-page-header">
        <h1 className="admin-page-title">Gestionar Usuarios</h1>
        {/* Podrías tener un botón para "Añadir Usuario" si lo implementas en el backend y form */}
        {/* <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="button button-primary add-button">
          <span role="img" aria-label="nuevo usuario" className="icon">➕</span> Nuevo Usuario
        </button> */}
      </header>

      {users.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id_user}>
                  <td>{user.id_user}</td>
                  <td data-label="Nombre">{user.nombre} {user.apellidoPaterno} {user.apellidoMaterno || ''}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Rol"><span className={`role-tag role-${user.rol}`}>{user.rol}</span></td>
                  <td data-label="Registrado">{new Date(user.fecha_registro).toLocaleDateString()}</td>
                  <td data-label="Acciones" className="table-actions">
                    <button onClick={() => handleEdit(user)} className="button-icon button-edit" title="Editar Usuario">✏️</button>
                    <button onClick={() => handleDelete(user.id_user, user.nombre)} className="button-icon button-danger" title="Eliminar Usuario">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p className="admin-no-data-message">No hay usuarios registrados (aparte de los administradores iniciales quizás).</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? `Editar Usuario: ${editingUser.nombre}` : 'Crear Nuevo Usuario'}>
        {editingUser && ( // Solo renderizar form si hay un usuario para editar
             <UserEditForm
                key={editingUser.id_user} // Forzar re-renderizado del form al cambiar de usuario
                userData={editingUser}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseModal}
            />
        )}
      </Modal>
    </div>
  );
}

export default AdminUsersPage;



