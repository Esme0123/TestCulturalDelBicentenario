    // controllers/adminUserController.js
    const db = require('../config/db'); 
    const bcrypt = require('bcrypt'); 

    // Obtener todos los usuarios (para admin)
    exports.getAllUsersAdmin = async (req, res) => {
        try {
            // Excluir la contraseña del resultado por seguridad
            const [users] = await db.query('SELECT id_user, nombre, apellidoPaterno, apellidoMaterno, email, rol FROM usuarios');
            res.json(users);
        } catch (error) {
            console.error("Error al obtener todos los usuarios (admin):", error);
            res.status(500).json({ message: 'Error interno al obtener la lista de usuarios.' });
        }
    };

    // Obtener un usuario específico por ID (para admin, para posible edición)
    exports.getUserByIdAdmin = async (req, res) => {
        const { id_user } = req.params;
        try {
            const [users] = await db.query('SELECT id_user, nombre, apellidoPaterno, apellidoMaterno, email, rol FROM usuarios WHERE id_user = ?', [id_user]);
            if (users.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.json(users[0]);
        } catch (error) {
            console.error(`Error al obtener usuario ${id_user} (admin):`, error);
            res.status(500).json({ message: 'Error interno al obtener el usuario.' });
        }
    };

    // Actualizar información de un usuario (ej. rol, por admin)
    exports.updateUserAdmin = async (req, res) => {
        const { id_user } = req.params;
        const { nombre, apellidoPaterno, apellidoMaterno, email, rol, contrasena } = req.body; // Admin podría cambiar contraseña

        if (!nombre || !apellidoPaterno || !email || !rol) {
            return res.status(400).json({ message: 'Nombre, apellido paterno, email y rol son requeridos.' });
        }
        if (rol !== 'user' && rol !== 'admin') {
            return res.status(400).json({ message: 'El rol debe ser "user" o "admin".' });
        }

        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Verificar si el nuevo email ya está en uso por OTRO usuario
            const [emailCheck] = await connection.query('SELECT id_user FROM usuarios WHERE email = ? AND id_user != ?', [email, id_user]);
            if (emailCheck.length > 0) {
                await connection.rollback();
                return res.status(409).json({ message: 'El nuevo email ya está en uso por otro usuario.' });
            }
            
            let hashedPassword = null;
            if (contrasena) {
                if (contrasena.length < 6) {
                    await connection.rollback();
                    return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
                }
                hashedPassword = await bcrypt.hash(contrasena, 10);
            }

            let sqlUpdate;
            let params;

            if (hashedPassword) {
                sqlUpdate = 'UPDATE usuarios SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, email = ?, rol = ?, contrasena = ? WHERE id_user = ?';
                params = [nombre, apellidoPaterno, apellidoMaterno || null, email, rol, hashedPassword, id_user];
            } else {
                sqlUpdate = 'UPDATE usuarios SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, email = ?, rol = ? WHERE id_user = ?';
                params = [nombre, apellidoPaterno, apellidoMaterno || null, email, rol, id_user];
            }

            const [result] = await connection.query(sqlUpdate, params);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Usuario no encontrado o datos sin cambios.' });
            }

            await connection.commit();
            res.json({ message: `Usuario ${id_user} actualizado correctamente.` });

        } catch (error) {
            if (connection) await connection.rollback();
            console.error(`Error al actualizar usuario ${id_user} (admin):`, error);
            if (error.code === 'ER_DUP_ENTRY') { // Por si acaso la validación de email falla
                return res.status(409).json({ message: 'El email ya está en uso (error de duplicado).' });
            }
            res.status(500).json({ message: 'Error interno al actualizar el usuario.' });
        } finally {
            if (connection) connection.release();
        }
    };


    // Eliminar un usuario (admin)
    exports.deleteUserAdmin = async (req, res) => {
        const { id_user } = req.params;
        // const adminMakingRequestId = req.userId; // Asumiendo que req.userId viene del token
        // if (parseInt(id_user, 10) === adminMakingRequestId) {
        //    return res.status(403).json({ message: "Un administrador no puede eliminarse a sí mismo." });
        // }

        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query('DELETE FROM usuarios WHERE id_user = ?', [id_user]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
            }

            await connection.commit();
            res.json({ message: `Usuario ${id_user} eliminado correctamente.` });

        } catch (error) {
            if (connection) await connection.rollback();
            console.error(`Error al eliminar usuario ${id_user} (admin):`, error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ message: 'No se puede eliminar el usuario porque tiene datos asociados (ej. historial, tests). Primero maneje esas dependencias.' });
            }
            res.status(500).json({ message: 'Error interno al eliminar el usuario.' });
        } finally {
            if (connection) connection.release();
        }
    };
    